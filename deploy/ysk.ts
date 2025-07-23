import assert from 'assert'
import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'YSK'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${network.name}`)
    console.log(`Deployer: ${deployer}`)
    const endpointV2Deployment = await hre.deployments.get('EndpointV2')

    const { address } = await deploy(contractName, {
        from: deployer,
        args: ['Yushaku', 'YSK', endpointV2Deployment.address, deployer],
        log: true,
        skipIfAlreadyDeployed: true,
    })

    console.log(`Deployed contract: ${contractName}, network: ${network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
