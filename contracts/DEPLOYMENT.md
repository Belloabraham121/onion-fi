# OnionFi Smart Contract Deployment Guide

## Prerequisites

1. **Foundry installed** - [Installation Guide](https://book.getfoundry.sh/getting-started/installation)
2. **Lisk testnet ETH** - Get from [Lisk Testnet Faucet](https://sepolia-faucet.lisk.com/)
3. **Private key** of the deployer wallet

## Setup

1. **Clone and setup the project:**

   ```bash
   cd contracts
   forge install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Required environment variables:**
   - `PRIVATE_KEY`: Your wallet private key (without 0x prefix)
   - `LISK_TESTNET_RPC_URL`: Lisk testnet RPC endpoint
   - `SUPPORTED_TOKEN_ADDRESS`: ERC20 token address to support
   - `AI_WALLET_ADDRESS`: Address that will trigger AI investments

## Deployment Commands

### Deploy to Lisk Testnet

```bash
# Basic deployment
forge script script/DeployOnionFi.s.sol:DeployOnionFi --rpc-url $LISK_TESTNET_RPC_URL --broadcast --verify

# Or with explicit parameters
forge script script/DeployOnionFi.s.sol:DeployOnionFi \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --broadcast \
  --verify \
  --chain-id 4202
```

### Dry Run (Simulation)

```bash
# Test deployment without broadcasting
forge script script/DeployOnionFi.s.sol:DeployOnionFi --rpc-url $LISK_TESTNET_RPC_URL
```

## Post-Deployment

1. **Save the contract address** from the deployment output
2. **Verify on Lisk Explorer**: Visit [Lisk Sepolia Explorer](https://sepolia-blockscout.lisk.com/)
3. **Update your frontend** with the new contract address
4. **Configure your AI system** with the contract details

## Network Details

- **Network Name**: Lisk Sepolia Testnet
- **Chain ID**: 4202
- **RPC URL**: https://rpc.sepolia-api.lisk.com
- **Explorer**: https://sepolia-blockscout.lisk.com/
- **Faucet**: https://sepolia-faucet.lisk.com/

## Contract Configuration

The deployment script will:

1. Deploy OnionFi contract with specified token and AI address
2. Set the deployer as the contract owner
3. Display deployment verification details
4. Provide next steps for integration

## Troubleshooting

### Common Issues:

1. **Insufficient funds**: Ensure your wallet has enough ETH for gas fees
2. **Invalid private key**: Check your .env file format
3. **RPC issues**: Try alternative RPC endpoints if one fails
4. **Gas estimation failed**: Increase gas limit or check contract size

### Gas Optimization:

```bash
# Check contract size
forge build --sizes

# Optimize compilation
forge build --optimize --optimizer-runs 200
```

## Security Notes

- ⚠️ **Never commit your .env file** to version control
- ⚠️ **Use a dedicated deployment wallet** for mainnet
- ⚠️ **Verify contract source code** after deployment
- ⚠️ **Test thoroughly** on testnet before mainnet deployment