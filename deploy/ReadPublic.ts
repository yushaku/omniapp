import { ChannelId } from '@layerzerolabs/lz-definitions'
import assert from 'assert'
import { ContractName, writeDownAddress } from '../utils'
import { type DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async (hre) => {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  assert(deployer, 'Missing named deployer account')

  console.log(`Network: ${network.name}`)
  console.log(`Deployer: ${deployer}`)

  const lzEndpointV2OnBaseTestnet = '0x6EDCE65403992e310A62460808c4b910D972f10f'
  const channelId = ChannelId.READ_CHANNEL_1

  const { address } = await deploy(ContractName.ReadPublic, {
    from: deployer,
    args: [lzEndpointV2OnBaseTestnet, deployer, channelId],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  console.log(`Deployed contract: ${ContractName.ReadPublic}, network: ${network.name}, address: ${address}`)

  await writeDownAddress(ContractName.ReadPublic, address, network.name)
}

deploy.tags = [ContractName.ReadPublic]

export default deploy
