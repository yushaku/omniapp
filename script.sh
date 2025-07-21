# Deploy MyPriceFeed on monad-testnet
npx hardhat deploy --tags MyPriceFeed --network monad-testnet
# 0xaCB2ccaBF5c98713F30B3BE71D65CF25d8E4799c
npx hardhat deploy --tags MyPriceFeed --network arbitrum-testnet
# 0x7d587C5751BbC7C583296564474F257678A952Ec

# Deploy ReadPublic on base-testnet
npx hardhat deploy --tags ReadPublic --network base-testnet
npx hardhat deploy --tags ReadPublic --network sepolia 
npx hardhat deploy --tags ReadPublicUpgradeable --network sepolia 
# 0x7d587C5751BbC7C583296564474F257678A952Ec

# readPrice
npx hardhat run scripts/readPrice.ts --network arbitrum-testnet 

# success: ReadPublic [sepolia] ----> PriceFeed [arbitrum]
npx hardhat lz:oapp-read:read \
--network sepolia \
--target-contract 0x7d587C5751BbC7C583296564474F257678A952Ec \
--target-eid 40231

npx hardhat lz:oapp-read:read \
--network base-testnet \
--target-contract 0x7d587C5751BbC7C583296564474F257678A952Ec \
--target-eid 40231

npx hardhat run scripts/verify.ts --network sepolia

# deploy to lz 
npx hardhat lz:deploy
# config endpoint + DVN + executor
npx hardhat lz:oapp-read:wire --oapp-config layerzero.config.ts


