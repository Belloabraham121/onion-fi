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
import OnionFiABI from "../lib/contracts/OnionFi.json";

// Type assertion for ABI
const abi = OnionFiABI.abi as any;

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

// Contract address - this should be set after deployment
const ONION_FI_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_ONION_FI_CONTRACT_ADDRESS ||
  "0xf468b3c575959c17a30b5d261db51354258b596c";

// Supported token addresses
export const SUPPORTED_TOKENS = {
  USDT: {
    address: "0x2728DD8B45B788e26d12B13Db5A244e5403e7eda",
    symbol: "USDT",
    name: "USD Token",
    decimals: 6,
  },
  LSK: {
    address: "0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D",
    symbol: "LSK",
    name: "Lisk Token",
    decimals: 18,
  },
} as const;

export type SupportedTokenKey = keyof typeof SUPPORTED_TOKENS;

const contract = getContract({
  client,
  chain: liskTestnet,
  address: ONION_FI_CONTRACT_ADDRESS,
  abi,
});

export function useOnionFi() {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Read contract data
  const { data: userBalance } = useReadContract({
    contract,
    method: "getUserBalance" as any,
    params: [account?.address || "0x0"],
  });

  const { data: supportedToken } = useReadContract({
    contract,
    method: "supportedToken" as any,
    params: [],
  });

  const { data: allProtocols } = useReadContract({
    contract,
    method: "getAllProtocols" as any,
    params: [],
  });

  const { data: userInvestments } = useReadContract({
    contract,
    method: "getUserAllInvestments" as any,
    params: [account?.address || "0x0"],
  });

  // Approve token spending
  const approveToken = useCallback(
    async (amount: string, tokenKey: SupportedTokenKey) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      const selectedToken = SUPPORTED_TOKENS[tokenKey];
      if (!selectedToken) {
        toast.error("Invalid token selected");
        return false;
      }

      try {
        setIsLoading(true);

        // Convert amount to wei based on token decimals
        const decimals = selectedToken.decimals;
        const amountInWei = BigInt(
          Math.floor(parseFloat(amount) * Math.pow(10, decimals))
        );

        // Create token contract for approval
        const tokenContract = getContract({
          client,
          chain: liskTestnet,
          address: selectedToken.address,
          abi: [
            {
              type: "function",
              name: "approve",
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ name: "", type: "bool" }],
              stateMutability: "nonpayable",
            },
          ],
        });

        const transaction = prepareContractCall({
          contract: tokenContract,
          method: "approve" as any,
          params: [ONION_FI_CONTRACT_ADDRESS, amountInWei],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success(
          `Approved ${amount} ${selectedToken.symbol} for spending`
        );
        return true;
      } catch (error) {
        console.error("Approval error:", error);
        toast.error("Token approval failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  // Deposit function with token selection
  const deposit = useCallback(
    async (amount: string, tokenKey: SupportedTokenKey) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      const selectedToken = SUPPORTED_TOKENS[tokenKey];
      if (!selectedToken) {
        toast.error("Invalid token selected");
        return false;
      }

      try {
        setIsLoading(true);

        // Convert amount to wei based on token decimals
        const decimals = selectedToken.decimals;
        const multiplier = Array(decimals)
          .fill(0)
          .reduce((acc) => acc * BigInt(10), BigInt(1));
        const amountInWei = BigInt(
          Math.floor(parseFloat(amount) * Math.pow(10, decimals))
        );

        const transaction = prepareContractCall({
          contract,
          method: "deposit" as any,
          params: [selectedToken.address, amountInWei],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success(
          `Deposit of ${amount} ${selectedToken.symbol} successful!`
        );
        return true;
      } catch (error) {
        console.error("Deposit error:", error);
        toast.error("Deposit failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  // Withdraw from available balance
  const withdrawAvailable = useCallback(
    async (amount: string) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      try {
        setIsLoading(true);

        const transaction = prepareContractCall({
          contract,
          method: "withdrawAvailableBalance" as any,
          params: [BigInt(amount)],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success("Withdrawal successful!");
        return true;
      } catch (error) {
        console.error("Withdrawal error:", error);
        toast.error("Withdrawal failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  // Withdraw from specific protocol
  const withdrawFromProtocol = useCallback(
    async (protocolName: string, amount: string) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      try {
        setIsLoading(true);

        const transaction = prepareContractCall({
          contract,
          method: "withdrawFromProtocol" as any,
          params: [protocolName, BigInt(amount)],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success(`Withdrawal from ${protocolName} successful!`);
        return true;
      } catch (error) {
        console.error("Protocol withdrawal error:", error);
        toast.error(
          `Withdrawal from ${protocolName} failed. Please try again.`
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  // Invest in protocol (for AI routing)
  const investInProtocol = useCallback(
    async (protocolName: string, amount: string, contractAddress: string) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      try {
        setIsLoading(true);

        const transaction = prepareContractCall({
          contract,
          method: "investInProtocol" as any,
          params: [
            protocolName,
            BigInt(amount),
            account.address,
            contractAddress,
          ],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success(`Investment in ${protocolName} successful!`);
        return true;
      } catch (error) {
        console.error("Investment error:", error);
        toast.error(`Investment in ${protocolName} failed. Please try again.`);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  // Claim yields
  const claimYields = useCallback(
    async (protocolName: string) => {
      if (!account) {
        toast.error("Please connect your wallet first");
        return false;
      }

      try {
        setIsLoading(true);

        const transaction = prepareContractCall({
          contract,
          method: "claimYields" as any,
          params: [protocolName],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        toast.success(`Yields from ${protocolName} claimed successfully!`);
        return true;
      } catch (error) {
        console.error("Claim yields error:", error);
        toast.error(
          `Failed to claim yields from ${protocolName}. Please try again.`
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  return {
    // State
    isLoading,
    account,

    // Contract data
    userBalance,
    supportedToken,
    allProtocols,
    userInvestments,

    // Functions
    approveToken,
    deposit,
    withdrawAvailable,
    withdrawFromProtocol,
    investInProtocol,
    claimYields,
  };
}

// AI Routing Hook
export function useAIRouting() {
  const { investInProtocol } = useOnionFi();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    protocolName: string;
    contractAddress: string;
    expectedYield: number;
    riskLevel: "low" | "medium" | "high";
    reasoning: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableProtocols, setAvailableProtocols] = useState<any[]>([]);

  const getAIRecommendation = useCallback(
    async (
      amount: string,
      preferences?: {
        riskTolerance?: "low" | "medium" | "high";
        investmentDuration?: "short" | "medium" | "long";
        preferredProtocols?: string[];
      }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai-routing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, userPreferences: preferences }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI recommendation");
        }

        const data = await response.json();
        setRecommendation(data);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        toast.error("Failed to get AI recommendation. Please try again.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getAvailableProtocols = useCallback(async () => {
    try {
      const response = await fetch("/api/ai-routing", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch protocols");
      }

      const data = await response.json();
      setAvailableProtocols(data.protocols || []);
      return data.protocols;
    } catch (err) {
      console.error("Error fetching protocols:", err);
      return [];
    }
  }, []);

  const executeAIInvestment = useCallback(
    async (amount: string, userPreferences?: any) => {
      const recommendation = await getAIRecommendation(amount, userPreferences);

      if (!recommendation) {
        return false;
      }

      const { protocolName, contractAddress, expectedYield } = recommendation;

      toast.info(
        `AI recommends investing in ${protocolName} with expected yield of ${expectedYield}%`
      );

      return await investInProtocol(protocolName, amount, contractAddress);
    },
    [getAIRecommendation, investInProtocol]
  );

  return {
    getAIRecommendation,
    getAvailableProtocols,
    executeAIInvestment,
    recommendation,
    availableProtocols,
    isLoading,
    error,
    clearRecommendation: () => setRecommendation(null),
  };
}
