"use client";

import { useState, useCallback } from "react";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { toast } from "sonner";

// Lisk Testnet configuration
const liskTestnet = defineChain({
  id: 4202,
  name: "Lisk Sepolia Testnet",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "https://rpc.sepolia-api.lisk.com",
  blockExplorers: [
    {
      name: "Lisk Sepolia Explorer",
      url: "https://sepolia-blockscout.lisk.com",
    },
  ],
});

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Standard ERC20 ABI for the functions we need
const ERC20_ABI = [
  {
    type: "function" as const,
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable" as const,
  },
  {
    type: "function" as const,
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view" as const,
  },
] as const;

const ONION_FI_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_ONION_FI_CONTRACT_ADDRESS || "";

export function useERC20(tokenAddress: string) {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);

  const contract = getContract({
    client,
    chain: liskTestnet,
    address: tokenAddress,
    abi: ERC20_ABI,
  });

  // Read token data
  const { data: balance } = useReadContract({
    contract,
    method: "balanceOf" as any,
    params: [account?.address || "0x0"],
  });

  const { data: allowance } = useReadContract({
    contract,
    method: "allowance" as any,
    params: [account?.address || "0x0", ONION_FI_CONTRACT_ADDRESS],
  });

  const { data: decimals } = useReadContract({
    contract,
    method: "decimals" as any,
    params: [],
  });

  const { data: symbol } = useReadContract({
    contract,
    method: "symbol" as any,
    params: [],
  });

  const { data: name } = useReadContract({
    contract,
    method: "name" as any,
    params: [],
  });

  // Approve token spending
  const approve = useCallback(
    async (amount: string) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      try {
        setIsLoading(true);

        const transaction = prepareContractCall({
          contract,
          method: "approve" as any,
          params: [ONION_FI_CONTRACT_ADDRESS, BigInt(amount)],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success("Token approval successful!");
        return true;
      } catch (error) {
        console.error("Approval error:", error);
        toast.error("Token approval failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account, contract]
  );

  // Approve maximum amount (for convenience)
  const approveMax = useCallback(async () => {
    const maxAmount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"; // 2^256 - 1
    return await approve(maxAmount);
  }, [approve]);

  // Check if amount is approved
  const isApproved = useCallback(
    (amount: string) => {
      if (!allowance) return false;
      return BigInt(allowance.toString()) >= BigInt(amount);
    },
    [allowance]
  );

  // Format token amount with decimals
  const formatAmount = useCallback(
    (amount: string | bigint) => {
      if (!decimals) return "0";
      // Use a helper function for BigInt exponentiation
      const divisor = Array(decimals).fill(0).reduce((acc) => acc * BigInt(10), BigInt(1));
      return (BigInt(amount) / divisor).toString();
    },
    [decimals]
  );

  // Parse token amount to wei
  const parseAmount = useCallback(
    (amount: string) => {
      if (!decimals) return "0";
      try {
        // Use a helper function for BigInt exponentiation
        const multiplier = Array(decimals).fill(0).reduce((acc) => acc * BigInt(10), BigInt(1));
        // Use a more precise approach for decimal handling
        const [integerPart, decimalPart = ""] = amount.split(".");
        const paddedDecimal = decimalPart.padEnd(decimals, "0").slice(0, decimals);
        const result = BigInt(integerPart) * multiplier + BigInt(paddedDecimal || "0");
        return result.toString();
      } catch (error) {
        console.error("Error parsing amount:", error);
        return "0";
      }
    },
    [decimals]
  );

  return {
    // State
    isLoading,

    // Token data
    balance,
    allowance,
    decimals,
    symbol,
    name,

    // Functions
    approve,
    approveMax,
    isApproved,
    formatAmount,
    parseAmount,
  };
}

// Helper hook for supported tokens
export function useSupportedTokens() {
  // USD Token: 0x2728DD8B45B788e26d12B13Db5A244e5403e7eda
  // LSK Token: 0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D

  const usdToken = useERC20("0x2728DD8B45B788e26d12B13Db5A244e5403e7eda");
  const lskToken = useERC20("0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D");

  return {
    usd: usdToken,
    lsk: lskToken,
  };
}