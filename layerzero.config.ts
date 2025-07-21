import { ChannelId, EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { type OAppReadOmniGraphHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaConfig = {
    readChannelConfigs: [
        {
            channelId: ChannelId.READ_CHANNEL_1,
            active: true,
            readLibrary: '0x908E86e9cb3F16CC94AE7569Bf64Ce2CE04bbcBE',
            ulnConfig: {
                requiredDVNs: ['0x530fbe405189204ef459fa4b767167e4d41e3a37'],
                executor: '0x718B92b5CB0a5552039B593faF724D182A881eDA',
                optionalDVNs: [],
                optionalDVNThreshold: 0,
            },
            enforcedOptions: [
                {
                    msgType: 1,
                    optionType: ExecutorOptionType.LZ_READ,
                    gas: 80000,
                    size: 1000000,
                    value: 0,
                },
            ],
        },
    ],
} as any

const config: OAppReadOmniGraphHardhat = {
    contracts: [
        // {
        //     contract: {
        //         eid: EndpointId.BASESEP_V2_TESTNET,
        //         contractName: 'ReadPublic',
        //     },
        //     config: {
        //         readChannelConfigs: [
        //             {
        //                 channelId: ChannelId.READ_CHANNEL_1,
        //                 active: true,
        //                 readLibrary: '0x29270F0CFC54432181C853Cd25E2Fb60A68E03f2',
        //                 ulnConfig: {
        //                     requiredDVNs: ['0xbf6ff58f60606edb2f190769b951d825bcb214e2'],
        //                     executor: '0x8A3D588D9f6AC041476b094f97FF94ec30169d3D',
        //                     optionalDVNs: [],
        //                     optionalDVNThreshold: 0
        //                 },
        //                 enforcedOptions: [
        //                     {
        //                         msgType: 1,
        //                         optionType: ExecutorOptionType.LZ_READ,
        //                         gas: 80000,
        //                         size: 1000000,
        //                         value: 0,
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // },
        {
            contract: {
                eid: EndpointId.SEPOLIA_V2_TESTNET,
                contractName: 'ReadPublic',
            },
            config: sepoliaConfig,
        },
        {
            contract: {
                eid: EndpointId.SEPOLIA_V2_TESTNET,
                contractName: 'ReadPublicUpgradeable',
            },
            config: sepoliaConfig,
        },
    ],
    connections: [],
}

export default config
