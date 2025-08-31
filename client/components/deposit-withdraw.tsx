"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOnionFi, useAIRouting } from "@/hooks/use-onion-fi";
import { useSupportedTokens } from "@/hooks/use-erc20";
import { toast } from "sonner";
import { DepositModal } from "@/components/deposit-modal";

export function DepositWithdraw() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const [withdrawType, setWithdrawType] = useState<"available" | "protocol">(
    "available"
  );

  const {
    isLoading: onionFiLoading,
    account,
    userBalance,
    allProtocols,
    userInvestments,
    deposit,
    withdrawAvailable,
    withdrawFromProtocol,
  } = useOnionFi();

  const {
    getAIRecommendation,
    executeAIInvestment,
    recommendation,
    isLoading: isAnalyzing,
    getAvailableProtocols,
    availableProtocols,
  } = useAIRouting();
  const { usd: usdToken } = useSupportedTokens();

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Parse amount to wei
      const amountInWei = usdToken.parseAmount(depositAmount);

      // Check if token is approved
      if (!usdToken.isApproved(amountInWei)) {
        toast.info("Approving token spending...");
        const approved = await usdToken.approve(amountInWei);
        if (!approved) return;
      }

      // Perform deposit (using USDT as default for backward compatibility)
      const success = await deposit(depositAmount, "USDT");
      if (success) {
        setDepositAmount("");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error("Deposit failed. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    try {
      const amountInWei = usdToken.parseAmount(withdrawAmount);
      let success = false;

      if (withdrawType === "available") {
        success = await withdrawAvailable(amountInWei);
      } else if (withdrawType === "protocol" && selectedProtocol) {
        success = await withdrawFromProtocol(selectedProtocol, amountInWei);
      }

      if (success) {
        setWithdrawAmount("");
        setSelectedProtocol("");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Withdrawal failed. Please try again.");
    }
  };

  const handleAIInvestment = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0 || !recommendation) {
      toast.error(
        "Please enter a valid investment amount and get AI recommendation first"
      );
      return;
    }

    try {
      const amountInWei = usdToken.parseAmount(depositAmount);

      // Check if token is approved
      if (!usdToken.isApproved(amountInWei)) {
        toast.info("Approving token spending...");
        const approved = await usdToken.approve(amountInWei);
        if (!approved) return;
      }

      const success = await executeAIInvestment(amountInWei);
      if (success) {
        setDepositAmount("");
        toast.success("AI investment completed successfully!");
      }
    } catch (error) {
      console.error("AI investment error:", error);
      toast.error("AI investment failed. Please try again.");
    }
  };

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0";
    return usdToken.formatAmount(balance.toString());
  };

  const isLoading = onionFiLoading || usdToken.isLoading;

  if (!account) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Please connect your wallet to start depositing and withdrawing
            funds.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Balance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="text-2xl font-bold">
                {formatBalance(usdToken.balance)} {usdToken.symbol}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">
                {formatBalance(userBalance?.[0])} {usdToken.symbol}
              </p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="text-2xl font-bold">
                {formatBalance(userBalance?.[1])} {usdToken.symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Actions */}
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Deposit & Invest</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit & Investment Options</CardTitle>
              <CardDescription>
                Deposit funds and choose how to invest them for maximum yield.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount to Deposit</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  disabled={onionFiLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Available: {formatBalance(usdToken.balance)} {usdToken.symbol}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Direct Deposit */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Direct Deposit</CardTitle>
                    <CardDescription>
                      Deposit the amount directly to the contract using USDT.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleDeposit}
                      disabled={
                        !depositAmount ||
                        parseFloat(depositAmount) <= 0 ||
                        onionFiLoading ||
                        !account
                      }
                      className="w-full"
                    >
                      {onionFiLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Deposit to Contract"
                      )}
                    </Button>
                    <DepositModal
                      trigger={
                        <Button variant="outline" className="w-full">
                          Choose Token
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>

                {/* AI Investment */}
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      AI Smart Investment
                    </CardTitle>
                    <CardDescription>
                      Let AI analyze and invest in the best protocol
                      automatically.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* AI Recommendation Display */}
                    {recommendation && (
                      <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-purple-700">
                            {recommendation.protocolName}
                          </h4>
                          <Badge
                            variant={
                              recommendation.riskLevel === "low"
                                ? "default"
                                : recommendation.riskLevel === "medium"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {recommendation.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {recommendation.reasoning}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span>
                            Expected Yield:{" "}
                            <strong>
                              {recommendation.expectedYield.toFixed(2)}%
                            </strong>
                          </span>
                          <span>
                            Confidence:{" "}
                            <strong>{recommendation.confidence}%</strong>
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          getAIRecommendation(depositAmount, {
                            riskTolerance: "medium",
                            investmentDuration: "medium",
                          })
                        }
                        disabled={
                          !depositAmount ||
                          parseFloat(depositAmount) <= 0 ||
                          isAnalyzing
                        }
                        variant="outline"
                        className="flex-1"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Analyzing...
                          </>
                        ) : (
                          "Get AI Recommendation"
                        )}
                      </Button>

                      <Button
                        onClick={handleAIInvestment}
                        disabled={
                          !recommendation ||
                          isAnalyzing ||
                          isLoading ||
                          !depositAmount
                        }
                        className="flex-1"
                        variant="default"
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Invest Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Token Approval Status */}
              {depositAmount && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {usdToken.isApproved(
                      usdToken.parseAmount(depositAmount)
                    ) ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Token spending approved
                      </span>
                    ) : (
                      "Token approval will be required before deposit"
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Withdraw from your available balance or specific protocol
                investments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  disabled={onionFiLoading}
                />
              </div>

              <div className="space-y-4">
                <Label>Withdrawal Source</Label>
                <Tabs
                  value={withdrawType}
                  onValueChange={(value) =>
                    setWithdrawType(value as "available" | "protocol")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="available">
                      Available Balance
                    </TabsTrigger>
                    <TabsTrigger value="protocol">
                      Protocol Investment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="available" className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Withdraw from your available balance:{" "}
                        {formatBalance(userBalance?.[0])} {usdToken.symbol}
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="protocol" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Protocol</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {userInvestments?.[0] &&
                          Array.isArray(userInvestments[0]) &&
                          (userInvestments[0] as string[]).map(
                            (protocolName: string, index: number) => (
                              <Button
                                key={protocolName}
                                variant={
                                  selectedProtocol === protocolName
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  setSelectedProtocol(protocolName)
                                }
                                className="justify-between"
                              >
                                <span>{protocolName}</span>
                                <Badge variant="secondary">
                                  {userInvestments[1] &&
                                  userInvestments[1][index]
                                    ? formatBalance(userInvestments[1][index])
                                    : "0"}{" "}
                                  {usdToken.symbol}
                                </Badge>
                              </Button>
                            )
                          )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={
                  onionFiLoading ||
                  !withdrawAmount ||
                  (withdrawType === "protocol" && !selectedProtocol)
                }
                className="w-full"
              >
                {onionFiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Withdraw"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
