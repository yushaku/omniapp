// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AddressCast } from "@layerzerolabs/lz-evm-protocol-v2/contracts/libs/AddressCast.sol";

import { OAppUpgradeable } from "./OAppUpgradeable.sol";

abstract contract OAppReadUpgradeable is OAppUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function __OAppRead_init(address _endpoint, address _delegate) public onlyInitializing {
        OAppUpgradeable.__OAppUpgradeable_init(_endpoint, _delegate);
    }

    // -------------------------------
    // Only Owner
    function setReadChannel(uint32 _channelId, bool _active) public virtual onlyOwner {
        _setPeer(_channelId, _active ? AddressCast.toBytes32(address(this)) : bytes32(0));
    }
}
