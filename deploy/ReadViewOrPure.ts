import { EndpointId, ChannelId } from '@layerzerolabs/lz-definitions'
import assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'ReadViewOrPure'
const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${network.name}`)
    console.log(`Deployer: ${deployer}`)

    // LayerZero endpoint address for monad-testnet (update if needed)
    const lzEndpointV2OnMonadTestnet = '0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff'
    const channelId = ChannelId.READ_CHANNEL_1
    const targetEid = EndpointId.BASE_V2_TESTNET

    // Read ExampleContract address from base-testnet deployment
    const targetContractAddress = '0x13ab2077Cd876c0647456855124ef00393f2c583'

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [lzEndpointV2OnMonadTestnet, channelId, targetEid, targetContractAddress],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
