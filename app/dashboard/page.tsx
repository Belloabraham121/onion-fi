"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Activity, DollarSign, Zap } from "lucide-react"
import Link from "next/link"

const protocols = [
  {
    id: 1,
    name: "Uniswap V3",
    category: "DEX",
    apy: "12.4%",
    tvl: "$2.1B",
    input: "ETH/USDC",
    output: "LP Tokens",
    risk: "Medium",
    status: "Active",
    api: "v3.uniswap.org",
    change: "+2.1%",
  },
  {
    id: 2,
    name: "Aave V3",
    category: "Lending",
    apy: "8.7%",
    tvl: "$5.8B",
    input: "USDC",
    output: "aUSDC",
    risk: "Low",
    status: "Active",
    api: "api.aave.com",
    change: "+0.8%",
  },
  {
    id: 3,
    name: "Compound III",
    category: "Lending",
    apy: "6.2%",
    tvl: "$1.9B",
    input: "USDT",
    output: "cUSDT",
    risk: "Low",
    status: "Active",
    api: "compound.finance",
    change: "-0.3%",
  },
  {
    id: 4,
    name: "Curve Finance",
    category: "DEX",
    apy: "15.8%",
    tvl: "$3.2B",
    input: "stETH/ETH",
    output: "CRV-LP",
    risk: "Medium",
    status: "Active",
    api: "api.curve.fi",
    change: "+4.2%",
  },
  {
    id: 5,
    name: "Yearn Finance",
    category: "Vault",
    apy: "18.9%",
    tvl: "$890M",
    input: "WETH",
    output: "yvWETH",
    risk: "High",
    status: "Active",
    api: "yearn.finance",
    change: "+6.7%",
  },
]

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Low":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "High":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "DEX":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "Lending":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    case "Vault":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export default function Dashboard() {
  const [selectedProtocols, setSelectedProtocols] = useState<number[]>([])
  const [depositAmount, setDepositAmount] = useState("")

  const toggleProtocol = (id: number) => {
    setSelectedProtocols((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const totalAPY =
    selectedProtocols.length > 0
      ? (
          selectedProtocols.reduce((sum, id) => {
            const protocol = protocols.find((p) => p.id === id)
            return sum + Number.parseFloat(protocol?.apy.replace("%", "") || "0")
          }, 0) / selectedProtocols.length
        ).toFixed(1)
      : "0.0"

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="w-px h-6 bg-gray-700" />
              <h1 className="text-xl font-semibold">OnionFi Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Activity className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">$12,450</p>
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
                  <p className="text-2xl font-bold text-white">{totalAPY}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Positions</p>
                  <p className="text-2xl font-bold text-white">{selectedProtocols.length}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Change</p>
                  <p className="text-2xl font-bold text-green-400">+$234</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deposit Section */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-white">Quick Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Enter amount (USD)"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 font-semibold"
                disabled={!depositAmount || selectedProtocols.length === 0}
              >
                Deposit & Optimize
              </Button>
            </div>
            {selectedProtocols.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">Select protocols below to enable deposits</p>
            )}
          </CardContent>
        </Card>

        {/* Protocols Table */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Available Protocols</CardTitle>
            <p className="text-gray-400">Select protocols to optimize your yield across multiple DeFi platforms</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Select</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Protocol</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">APY</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">TVL</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Input/Output</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Risk</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">API Endpoint</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {protocols.map((protocol) => (
                    <tr
                      key={protocol.id}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                        selectedProtocols.includes(protocol.id) ? "bg-blue-500/10" : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedProtocols.includes(protocol.id)}
                          onChange={() => toggleProtocol(protocol.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{protocol.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getCategoryColor(protocol.category)}>{protocol.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-green-400 font-semibold">{protocol.apy}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{protocol.tvl}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="text-gray-300">{protocol.input}</div>
                          <div className="text-gray-500">→ {protocol.output}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRiskColor(protocol.risk)}>{protocol.risk}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{protocol.api}</code>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-medium ${
                            protocol.change.startsWith("+") ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {protocol.change}
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
    </div>
  )
}
