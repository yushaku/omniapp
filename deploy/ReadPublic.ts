import { ChannelId } from '@layerzerolabs/lz-definitions'
import assert from 'assert'
import { ContractName } from '../utils'
import { type DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async (hre) => {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  assert(deployer, 'Missing named deployer account')

  console.log(`Network: ${network.name}`)
  console.log(`Deployer: ${deployer}`)

  const endpointV2Deployment = await hre.deployments.get('EndpointV2')
  const channelId = ChannelId.READ_CHANNEL_1

  const { address } = await deploy(ContractName.ReadPublic, {
    from: deployer,
    args: [
      endpointV2Deployment.address,
      deployer,
      channelId,
    ],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  console.log(`Deployed contract: ${ContractName.ReadPublic}, network: ${network.name}, address: ${address}`)
}

deploy.tags = [ContractName.ReadPublic]

export default deploy
