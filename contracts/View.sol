// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import necessary interfaces and contracts
import { AddressCast } from "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/AddressCast.sol";
import { MessagingFee, MessagingReceipt } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import { Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OAppOptionsType3 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { OAppRead } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppRead.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { EVMCallRequestV1, ReadCodecV1 } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/ReadCodecV1.sol";

/// @title IExampleContract
/// @notice Interface for the ExampleContract's `add` function.
interface IExampleContract {
    function add(uint256 a, uint256 b) external pure returns (uint256);
}

contract ExampleContract {
    function add(uint256 a, uint256 b) external pure returns (uint256 sum) {
        return a + b;
    }
}

/// @title ReadViewOrPure Example
/// @notice An OAppRead contract that calls view/pure functions on target chains and receives results
contract ReadViewOrPure is OAppRead, OAppOptionsType3 {
    /// @notice Emitted when cross-chain function data is successfully received
    event SumReceived(uint256 sum);

    /// @notice LayerZero read channel ID for cross-chain data requests
    uint32 public READ_CHANNEL;

    /// @notice Message type identifier for read operations
    uint16 public constant READ_TYPE = 1;

    /// @notice Target chain's LayerZero Endpoint ID (immutable after deployment)
    uint32 public immutable targetEid;

    /// @notice Address of the contract to read from on the target chain
    address public immutable targetContractAddress;

    /**
     * @notice Initialize the cross-chain read contract
     * @dev Sets up LayerZero connectivity and establishes read channel peer relationship
     * @param _endpoint LayerZero endpoint address on the source chain
     * @param _readChannel Read channel ID for this contract's operations
     * @param _targetEid Destination chain's endpoint ID where target contract lives
     * @param _targetContractAddress Contract address to read from on target chain
     */
    constructor(
        address _endpoint,
        uint32 _readChannel,
        uint32 _targetEid,
        address _targetContractAddress
    ) OAppRead(_endpoint, msg.sender) Ownable(msg.sender) {
        READ_CHANNEL = _readChannel;
        targetEid = _targetEid;
        targetContractAddress = _targetContractAddress;

        // Establish read channel peer - contract reads from itself via LayerZero
        _setPeer(READ_CHANNEL, AddressCast.toBytes32(address(this)));
    }

    /**
     * @notice Configure the LayerZero read channel for this contract
     * @dev Owner-only function to activate/deactivate read channels
     * @param _channelId Read channel ID to configure
     * @param _active Whether to activate (true) or deactivate (false) the channel
     */
    function setReadChannel(uint32 _channelId, bool _active) public override onlyOwner {
        // Set or clear the peer relationship for the read channel
        _setPeer(_channelId, _active ? AddressCast.toBytes32(address(this)) : bytes32(0));
        READ_CHANNEL = _channelId;
    }

    /**
     * @notice Execute a cross-chain read request to call the target function
     * @dev Builds the read command and sends it via LayerZero messaging
     * @param _a First parameter for the target function
     * @param _b Second parameter for the target function
     * @param _extraOptions Additional execution options (gas, value, etc.)
     * @return receipt LayerZero messaging receipt containing transaction details
     */
    function readSum(
        uint256 _a,
        uint256 _b,
        bytes calldata _extraOptions
    ) external payable returns (MessagingReceipt memory) {
        // 1. Build the read command specifying target function and parameters
        bytes memory cmd = _getCmd(_a, _b);

        // 2. Send the read request via LayerZero
        return
            _lzSend(
                READ_CHANNEL,
                cmd,
                combineOptions(READ_CHANNEL, READ_TYPE, _extraOptions),
                MessagingFee(msg.value, 0),
                payable(msg.sender)
            );
    }

    /**
     * @notice Get estimated messaging fee for a cross-chain read operation
     * @dev Calculates LayerZero fees before sending to avoid transaction failures
     * @param _a First parameter for the target function
     * @param _b Second parameter for the target function
     * @param _extraOptions Additional execution options
     * @return fee Estimated LayerZero messaging fee structure
     */
    function quoteReadFee(
        uint256 _a,
        uint256 _b,
        bytes calldata _extraOptions
    ) external view returns (MessagingFee memory fee) {
        // Build the same command as readSum and quote its cost
        return _quote(READ_CHANNEL, _getCmd(_a, _b), combineOptions(READ_CHANNEL, READ_TYPE, _extraOptions), false);
    }

    /**
     * @notice Build the LayerZero read command for target function execution
     * @dev Constructs EVMCallRequestV1 specifying what data to fetch and from where
     * @param _a First parameter to pass to target function
     * @param _b Second parameter to pass to target function
     * @return Encoded read command for LayerZero execution
     */
    function _getCmd(uint256 _a, uint256 _b) internal view returns (bytes memory) {
        // 1. Build the function call data
        // Encode the target function selector with parameters
        bytes memory callData = abi.encodeWithSelector(IExampleContract.add.selector, _a, _b);

        // 2. Create the read request structure
        EVMCallRequestV1[] memory readRequests = new EVMCallRequestV1[](1);
        readRequests[0] = EVMCallRequestV1({
            appRequestLabel: 1, // Request identifier for tracking
            targetEid: targetEid, // Which chain to read from
            isBlockNum: false, // Use timestamp instead of block number for data freshness
            blockNumOrTimestamp: uint64(block.timestamp), // Read current state
            confirmations: 15, // Wait for block finality before executing
            to: targetContractAddress, // Target contract address
            callData: callData // The function call to execute
        });

        // 3. Encode the command (no compute logic needed for simple reads)
        return ReadCodecV1.encode(0, readRequests);
    }

    /**
     * @notice Process the received data from the target chain
     * @dev Called by LayerZero when the read response is delivered
     * @param _message Encoded response data from the target function call
     */
    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata _message,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        // 1. Validate response format
        require(_message.length == 32, "Invalid message length");

        // 2. Decode the returned data (matches target function return type)
        uint256 sum = abi.decode(_message, (uint256));

        // 3. Process the result (emit event, update state, trigger logic, etc.)
        emit SumReceived(sum);
    }
}
