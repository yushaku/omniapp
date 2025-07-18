import { formatUnits, parseUnits } from 'ethers/lib/utils'
import hre from 'hardhat'

async function main() {
    const { deployments, ethers, network } = hre as any
    const { get } = deployments

    console.log('Reading price...')
    console.log(`Network:   ${network.name}`)

    const priceFeedDeployment = await get('MyPriceFeed')
    // console.log(priceFeedDeployment)
    console.log(`PriceFeed: ${priceFeedDeployment.address}`)

    const [signer] = await hre.ethers.getSigners()
    const priceFeed = await ethers.getContractAt('MyPriceFeed', priceFeedDeployment.address, signer)
    const price = await priceFeed.getPrice()
    console.log(`Price: ${price}`)

    // const tx = await priceFeed.setPrice(parseUnits('400', 18))
    // await tx.wait()

    // const newPrice = await priceFeed.getPrice()
    // console.log(`New price: ${newPrice}`)
}

main().catch((err) => {
    console.error(err)
    process.exitCode = 1
})
