"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useOnionFi,
  SUPPORTED_TOKENS,
  SupportedTokenKey,
} from "@/hooks/use-onion-fi";
import { useERC20 } from "@/hooks/use-erc20";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface DepositModalProps {
  trigger?: React.ReactNode;
}

export function DepositModal({ trigger }: DepositModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<SupportedTokenKey>("USDT");
  const [amount, setAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const { approveToken, deposit, account } = useOnionFi();
  const {
    balance: tokenBalance,
    allowance,
    formatAmount,
  } = useERC20(SUPPORTED_TOKENS[selectedToken].address);

  const selectedTokenInfo = SUPPORTED_TOKENS[selectedToken];
  const formattedBalance = formatAmount(tokenBalance || "0");
  const formattedAllowance = formatAmount(allowance || "0");

  const needsApproval =
    allowance !== undefined &&
    amount &&
    parseFloat(amount) > parseFloat(formattedAllowance);

  const handleApprove = async () => {
    if (!amount || !selectedToken) {
      toast.error("Please enter an amount and select a token");
      return;
    }

    setIsApproving(true);
    try {
      const success = await approveToken(amount, selectedToken);
      if (success) {
        toast.success("Token approved successfully!");
      }
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !selectedToken) {
      toast.error("Please enter an amount and select a token");
      return;
    }

    if (parseFloat(amount) > parseFloat(formattedBalance)) {
      toast.error("Insufficient balance");
      return;
    }

    setIsDepositing(true);
    try {
      const success = await deposit(amount, selectedToken);
      if (success) {
        setAmount("");
        setIsOpen(false);
        toast.success("Deposit successful!");
      }
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(formattedBalance);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Deposit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Tokens</DialogTitle>
          <DialogDescription>
            Select a token and amount to deposit into OnionFi
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Token Selection */}
          <div className="grid gap-2">
            <Label htmlFor="token">Token</Label>
            <Select
              value={selectedToken}
              onValueChange={(value: SupportedTokenKey) =>
                setSelectedToken(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_TOKENS).map(([key, token]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-sm text-muted-foreground">
                        ({token.name})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 px-2 text-xs"
                onClick={handleMaxClick}
              >
                MAX
              </Button>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Balance: {formattedBalance} {selectedTokenInfo.symbol}
              </span>
              {allowance && (
                <span>
                  Allowance: {formattedAllowance} {selectedTokenInfo.symbol}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {needsApproval && (
              <Button
                onClick={handleApprove}
                disabled={!account || !amount || isApproving || isDepositing}
                className="flex-1"
                variant="outline"
              >
                {isApproving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Approve {selectedTokenInfo.symbol}
              </Button>
            )}

            <Button
              onClick={handleDeposit}
              disabled={
                !account ||
                !amount ||
                needsApproval ||
                isApproving ||
                isDepositing
              }
              className="flex-1"
            >
              {isDepositing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Deposit
            </Button>
          </div>

          {!account && (
            <p className="text-sm text-muted-foreground text-center">
              Please connect your wallet to deposit
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
