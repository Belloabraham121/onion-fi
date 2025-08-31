"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  Bot,
  DollarSign,
  TrendingUp,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const vaults = [
  {
    id: 1,
    name: "AI Optimized Vault",
    strategy: "Multi-Protocol",
    apy: "24.8%",
    tvl: "$4.2M",
    balance: "$1,250",
    risk: "Medium",
    aiScore: 95,
    change: "+5.2%",
  },
  {
    id: 2,
    name: "Stable Yield Vault",
    strategy: "Lending Focus",
    apy: "12.1%",
    tvl: "$8.7M",
    balance: "$2,100",
    risk: "Low",
    aiScore: 88,
    change: "+2.8%",
  },
  {
    id: 3,
    name: "High Risk Vault",
    strategy: "DEX Arbitrage",
    apy: "45.6%",
    tvl: "$1.9M",
    balance: "$0",
    risk: "High",
    aiScore: 92,
    change: "+12.4%",
  },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "High":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const getAIScoreColor = (score: number) => {
  if (score >= 90) return "text-green-400";
  if (score >= 80) return "text-yellow-400";
  return "text-red-400";
};

export function VaultsTab() {
  const [selectedVault, setSelectedVault] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [actionType, setActionType] = useState<
    "deposit" | "withdraw" | "ai-route"
  >("deposit");

  const handleVaultAction = () => {
    if (!selectedVault) return;

    // Simulate vault action
    console.log(`${actionType} action for vault ${selectedVault}`, {
      depositAmount,
      withdrawAmount,
    });

    // Reset form
    setDepositAmount("");
    setWithdrawAmount("");
    setSelectedVault(null);
  };

  const totalBalance = vaults.reduce((sum, vault) => {
    return sum + parseFloat(vault.balance.replace("$", "").replace(",", ""));
  }, 0);

  const avgAPY =
    vaults.reduce((sum, vault) => {
      const balance = parseFloat(
        vault.balance.replace("$", "").replace(",", "")
      );
      const apy = parseFloat(vault.apy.replace("%", ""));
      return sum + (balance > 0 ? apy : 0);
    }, 0) /
      vaults.filter(
        (v) => parseFloat(v.balance.replace("$", "").replace(",", "")) > 0
      ).length || 0;

  return (
    <div className="space-y-8">
      {/* Vault Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${totalBalance.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Average APY</p>
                <p className="text-2xl font-bold text-white">
                  {avgAPY.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">AI Optimizations</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">24h Yield</p>
                <p className="text-2xl font-bold text-green-400">+$42.50</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vault Actions */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Vault Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Action Type Selector */}
            <div className="flex gap-2">
              <Button
                variant={actionType === "deposit" ? "default" : "outline"}
                onClick={() => setActionType("deposit")}
                className={
                  actionType === "deposit"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button
                variant={actionType === "withdraw" ? "default" : "outline"}
                onClick={() => setActionType("withdraw")}
                className={
                  actionType === "withdraw"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }
              >
                <ArrowDown className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button
                variant={actionType === "ai-route" ? "default" : "outline"}
                onClick={() => setActionType("ai-route")}
                className={
                  actionType === "ai-route"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Route
              </Button>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                {actionType === "deposit" && (
                  <input
                    type="number"
                    placeholder="Enter deposit amount (USD)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                {actionType === "withdraw" && (
                  <input
                    type="number"
                    placeholder="Enter withdraw amount (USD)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
                {actionType === "ai-route" && (
                  <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
                    AI will automatically optimize your funds across vaults
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={handleVaultAction}
                disabled={
                  !selectedVault ||
                  (actionType === "deposit" && !depositAmount) ||
                  (actionType === "withdraw" && !withdrawAmount)
                }
                className={`px-8 py-3 font-semibold ${
                  actionType === "ai-route"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                } text-white`}
              >
                {actionType === "deposit" && "Deposit"}
                {actionType === "withdraw" && "Withdraw"}
                {actionType === "ai-route" && "Optimize with AI"}
              </Button>
            </div>
            {!selectedVault && (
              <p className="text-sm text-gray-400">
                Select a vault below to enable actions
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vaults Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Available Vaults</CardTitle>
          <p className="text-gray-400">
            AI-powered vaults that automatically optimize your yield
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Select
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Vault
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Strategy
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    APY
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    TVL
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Your Balance
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    Risk
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    AI Score
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {vaults.map((vault) => (
                  <tr
                    key={vault.id}
                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                      selectedVault === vault.id ? "bg-blue-500/10" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <input
                        type="radio"
                        name="selectedVault"
                        checked={selectedVault === vault.id}
                        onChange={() => setSelectedVault(vault.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{vault.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        {vault.strategy}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-semibold">
                        {vault.apy}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{vault.tvl}</td>
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">
                        {vault.balance}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRiskColor(vault.risk)}>
                        {vault.risk}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-400" />
                        <span
                          className={`font-semibold ${getAIScoreColor(
                            vault.aiScore
                          )}`}
                        >
                          {vault.aiScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-medium ${
                          vault.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {vault.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
