import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'
import { parseUnits } from 'ethers/lib/utils'

const contractName = 'MyPriceFeed'

const deploy: DeployFunction = async (hre) => {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  assert(deployer, 'Missing named deployer account')

  console.log(`Network: ${network.name}`)
  console.log(`Deployer: ${deployer}`)

  const initialPrice = parseUnits('1', 18)

  const { address } = await deploy(contractName, {
    from: deployer,
    args: [initialPrice],
    log: true,
    skipIfAlreadyDeployed: false,
  })

  console.log(`Deployed contract: ${contractName}, network: ${network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
