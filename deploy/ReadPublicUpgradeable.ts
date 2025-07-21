import { ChannelId } from '@layerzerolabs/lz-definitions'
import assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'
import { verifyContract } from '../utils'

const contractName = 'ReadPublicUpgradeable'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, network, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${network.name}`)
    console.log(`Deployer: ${deployer}`)

    const endpointV2Deployment = await hre.deployments.get('EndpointV2')
    const channelId = ChannelId.READ_CHANNEL_1

    console.log({
        endpointV2Deployment: endpointV2Deployment.address,
        channelId,
    })

    // Deploy custom proxy admin first
    const proxyAdminName = `${contractName}ProxyAdmin`
    await deploy(proxyAdminName, {
        from: deployer,
        contract: 'ProxyAdmin',
        args: [deployer], // ProxyAdmin constructor requires initial owner
        log: true,
        skipIfAlreadyDeployed: true,
    })

    // Deploy upgradeable proxy
    const res = await deploy(contractName, {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 1,
        autoMine: true,
        skipIfAlreadyDeployed: false,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
            viaAdminContract: {
                name: proxyAdminName,
                artifact: 'ProxyAdmin',
            },
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [endpointV2Deployment.address, deployer, channelId],
                },
            },
        },
    })

    console.log(
        `Deployed upgradeable proxy for contract: ${contractName}, network: ${network.name}, address: ${res.address}`
    )

    // await verifyContract(res.address, [endpointV2Deployment.address, deployer, channelId])

    await verifyContract('0x1af306d5bb8eb20c321c733274dc45cf5f0b67a9', [])
}

deploy.tags = [contractName]

export default deploy
