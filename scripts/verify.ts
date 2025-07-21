import hre from 'hardhat'
import { verifyContract } from '../utils'
import { ChannelId } from '@layerzerolabs/lz-definitions'

async function verify() {
  const { deployments } = hre as any
  const { get } = deployments

  const readDeployment = await get('ReadPublicUpgradeable_Implementation')
  const lzEndpointV2OnBaseTestnet = '0x6EDCE65403992e310A62460808c4b910D972f10f'
  const channelId = ChannelId.READ_CHANNEL_1
  const deployer = '0xd23714A6662eA86271765acF906AECA80EF7d6Fa'

  verifyContract(readDeployment.address, readDeployment.args)

  // const priceFeedDeployment = await get('MyPriceFeed')
  // const priceFeedAddress = priceFeedDeployment.address
  // const constructorArgs = priceFeedDeployment.args

  // verifyContract(priceFeedAddress, constructorArgs)
}

verify().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
