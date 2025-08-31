// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/OnionFi.sol";

contract DeployOnionFi is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying OnionFi contract...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Configure supported tokens
        address supportedTokenUsd = 0x2728DD8B45B788e26d12B13Db5A244e5403e7eda; // USD token
        address supportedTokenLSK = 0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D; // LSK token

        // AI address - replace with your actual AI wallet address
        address aiAddress = 0xeeD71459493CDda2d97fBefbd459701e356593f3; // Using deployer as AI address for now

        // Deploy OnionFi contract with USD token as primary supported token
        OnionFi onionFi = new OnionFi(supportedTokenUsd, aiAddress);

        console.log("OnionFi deployed at:", address(onionFi));
        console.log("Primary supported token (USD):", supportedTokenUsd);
        console.log("Secondary supported token (LSK):", supportedTokenLSK);
        console.log("AI address:", aiAddress);

        vm.stopBroadcast();

        // Verify deployment
        console.log("\n=== Deployment Verification ===");
        console.log("Contract owner:", onionFi.owner());
        console.log("Contract paused:", onionFi.paused());
        console.log("Protocol count:", onionFi.protocolCount());

        console.log("\n=== Deployment Complete ===");
        console.log("Contract Address:", address(onionFi));
        console.log("Network: Lisk Testnet");
        console.log("\nNext steps:");
        console.log("1. Verify contract on Lisk testnet explorer");
        console.log("2. Update frontend with contract address");
        console.log("3. Configure AI system with contract details");
    }
}
