import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { BigNumberish } from 'ethers'

async function main() {
  const hre: HardhatRuntimeEnvironment = require('hardhat')

  const { deployments, network } = hre
  const { get } = deployments

  // Load PriceFeed deployment for the current network
  const deployment = await get('PriceFeed')
  const priceFeedAddress: string = deployment.address

  const constructorArgs: BigNumberish[] = deployment.args as BigNumberish[]

  console.log(`Verifying PriceFeed on network ${network.name}`)
  console.log(`Address: ${priceFeedAddress}`)
  console.log(`Constructor args:`, constructorArgs)

  // Trigger hardhat-verify task
  await hre.run('verify:verify', {
    address: priceFeedAddress,
    constructorArguments: constructorArgs,
  })

  console.log('Verification submitted ✅')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
