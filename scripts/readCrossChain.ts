import { ethers } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { EndpointId } from '@layerzerolabs/lz-definitions'

/**
 * readCrossChain.ts
 *
 * Sends a LayerZero Read request from the current network (where ReadPublic is deployed)
 * to fetch `getPrice()` from a PriceFeed contract on a remote chain.
 *
 * Environment variables required:
 *   TARGET_PRICEFEED  – Address of PriceFeed on the remote chain
 *   TARGET_EID        – EndpointId (uint32) of the remote chain as defined in @layerzerolabs/lz-definitions
 *   EXTRA_OPTIONS     – (optional) hex-encoded LayerZero options (defaults to 0x)
 */

async function main() {
  const hre: HardhatRuntimeEnvironment = require('hardhat')
  const { deployments, ethers: hhEthers, network } = hre as any

  const { get } = deployments

  const readDeployment = await get('ReadPublic')
  const readPublic = await hhEthers.getContractAt('ReadPublic', readDeployment.address)

  const targetPriceFeed = '0x13ab2077Cd876c0647456855124ef00393f2c583'
  const targetEid = EndpointId.MONAD_V2_TESTNET
  const extraOptions = '0x'


  console.log(`Network (source):      base-testnet`)
  console.log(`Network (destination): monad-testnet`)
  console.log(`ReadPublic  : ${readDeployment.address}`)
  console.log(`Target PF   : ${targetPriceFeed}`)
  console.log(`Target EID  : ${targetEid}`)

  // 1. Quote fee
  const fee = await readPublic.quoteReadFee(targetPriceFeed, targetEid, extraOptions)
  console.log(`Native fee needed: ${ethers.utils.formatEther(fee.nativeFee)} ETH`)

  // 2. Send read request, forwarding the quoted fee
  const tx = await readPublic.readData(targetPriceFeed, targetEid, extraOptions, {
    value: fee.nativeFee,
  })
  console.log(`readData tx sent: ${tx.hash}`)
  await tx.wait()
  console.log('✈️ Read request submitted, wait for DataReceived event')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
