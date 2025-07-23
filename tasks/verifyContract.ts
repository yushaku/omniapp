import { task, types } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { createLogger } from '@layerzerolabs/io-devtools'

const logger = createLogger()

task('verify:contract', 'Verifies a deployed contract on Etherscan using deployment artifacts')
    .addParam('name', 'The deployed contract name', undefined, types.string)
    .setAction(async (args: { name: string }, hre: HardhatRuntimeEnvironment) => {
        logger.info(`Verifying contract '${args.name}' on network '${hre.network.name}'`)

        const deployment = await hre.deployments.get(args.name)
        const address = deployment.address
        const constructorArgs = deployment.args || []
        logger.info(`Found contract at address: ${address}`)
        logger.info(`Constructor arguments: ${JSON.stringify(constructorArgs)}`)

        try {
            await hre.run('verify:verify', {
                address,
                constructorArguments: constructorArgs,
            })
            logger.info('Verification process completed.')
        } catch (e: any) {
            if (e.message.toLowerCase().includes('already verified')) {
                console.log('Already verified!')
            } else {
                console.log(e.message)
            }
        }
    })
