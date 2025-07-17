# Deploy PriceFeed on monad-testnet
npx hardhat deploy --tags PriceFeed --network monad-testnet

# PriceFeed address on monad-testnet
# 0x7d587C5751BbC7C583296564474F257678A952Ec


# Deploy ReadPublic on base-testnet
npx hardhat deploy --tags ReadPublic --network base-testnet
# base [ReadPublic]  ---->   monad-testnet [PriceFeed]

# readCrossChain
npx hardhat run scripts/readCrossChain.ts --network base-testnet
