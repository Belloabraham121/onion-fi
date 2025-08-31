"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Activity, DollarSign, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WalletConnect } from "@/components/wallet-connect";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { VaultsTab } from "@/components/vaults-tab";
import { getProtocolsData, Protocol } from "@/lib/defi-llama-api";

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

const getCategoryColor = (category: string) => {
  switch (category) {
    case "DEX":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Lending":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Vault":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function Dashboard() {
  const [selectedProtocols, setSelectedProtocols] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"protocols" | "vaults">(
    "protocols"
  );
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Dashboard: Starting to fetch Lisk protocols...');
        const data = await getProtocolsData();
        console.log('Dashboard: Received protocols data:', data);
        console.log('Dashboard: Number of protocols:', data.length);
        setProtocols(data);
      } catch (err) {
        console.error('Dashboard: Error in fetchProtocols:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to fetch protocols data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  const toggleProtocol = (id: number) => {
    setSelectedProtocols((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const totalAPY =
    selectedProtocols.length > 0
      ? (
          selectedProtocols.reduce((sum, id) => {
            const protocol = protocols.find((p) => p.id === id);
            return (
              sum + Number.parseFloat(protocol?.apy.replace("%", "") || "0")
            );
          }, 0) / selectedProtocols.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="w-px h-6 bg-gray-700" />
              <h1 className="text-xl font-semibold">OnionFi Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === "protocols" ? (
          <>
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
                      <p className="text-2xl font-bold text-white">
                        {totalAPY}%
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
                      <p className="text-sm text-gray-400">Active Positions</p>
                      <p className="text-2xl font-bold text-white">
                        {selectedProtocols.length}
                      </p>
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

            {/* Protocols Table */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Available Lisk Protocols ({protocols.length})
                </CardTitle>
                <p className="text-gray-400">
                  Select Lisk-based protocols to optimize your yield across multiple DeFi
                  platforms
                </p>
                <p className="text-sm text-blue-400">
                  {loading 
                    ? "Loading Lisk protocol data..."
                    : protocols.length > 0 
                      ? `✅ Successfully loaded ${protocols.length} Lisk protocols with real-time TVL data`
                      : "❌ No Lisk protocols found"
                  }
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
                          Protocol
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          Chain
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          Category
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          APY
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          TVL (Lisk)
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          Input/Output
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          Risk
                        </th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">
                          24h Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                         <tr>
                           <td colSpan={9} className="py-8 text-center text-gray-400">
                             Loading protocols...
                           </td>
                         </tr>
                       ) : error ? (
                         <tr>
                           <td colSpan={9} className="py-8 text-center text-red-400">
                             {error}
                           </td>
                         </tr>
                      ) : protocols.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-gray-400">
                            No protocols available
                          </td>
                        </tr>
                      ) : (
                        protocols.map((protocol) => (
                        <tr
                          key={protocol.id}
                          className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                            selectedProtocols.includes(protocol.id)
                              ? "bg-blue-500/10"
                              : ""
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
                            <div className="flex items-center gap-3">
                              <Image
                                src={protocol.logo}
                                alt={`${protocol.name} logo`}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                              <div className="flex flex-col">
                                <div className="font-medium text-white">
                                  {protocol.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              Lisk
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={getCategoryColor(protocol.category)}
                            >
                              {protocol.category}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-green-400 font-semibold">
                              {protocol.apy}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {protocol.tvl}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-gray-300">
                              <span>{protocol.input}</span>
                              <span>→</span>
                              <span>{protocol.output}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getRiskColor(protocol.risk)}>
                              {protocol.risk}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                              <span className={`font-medium ${
                                protocol.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {protocol.change}
                              </span>
                            </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <VaultsTab />
        )}
      </div>
    </div>
  );
}
