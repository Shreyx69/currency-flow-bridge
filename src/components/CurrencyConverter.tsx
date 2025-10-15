import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchExchangeRate = async (from: string, to: string) => {
    setLoading(true);
    try {
      // Using exchangerate-api.com free tier
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );
      const data = await response.json();
      
      if (data.rates && data.rates[to]) {
        const rate = data.rates[to];
        setExchangeRate(rate);
        setLastUpdate(new Date());
        return rate;
      } else {
        throw new Error("Currency rate not found");
      }
    } catch (error) {
      toast.error("Failed to fetch exchange rates");
      console.error("Error fetching exchange rate:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const convertCurrency = async () => {
      const rate = await fetchExchangeRate(fromCurrency, toCurrency);
      if (rate !== null) {
        const numAmount = parseFloat(amount) || 0;
        setResult(numAmount * rate);
      }
    };

    convertCurrency();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    setResult(numAmount * exchangeRate);
  }, [amount, exchangeRate]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setExchangeRate(exchangeRate > 0 ? 1 / exchangeRate : 0);
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl shadow-card hover:shadow-hover transition-all duration-300 border-border/50">
        <div className="space-y-8">
          {/* From Currency */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">From</label>
            <div className="flex gap-4">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-[180px] h-14 text-lg border-input bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currency.flag}</span>
                        <span className="font-medium">{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 h-14 text-2xl font-semibold border-input bg-background/50 focus:ring-primary"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSwap}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">To</label>
            <div className="flex gap-4">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-[180px] h-14 text-lg border-input bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currency.flag}</span>
                        <span className="font-medium">{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 h-14 px-4 rounded-lg border border-input bg-secondary/30 flex items-center">
                {loading ? (
                  <div className="w-full h-6 bg-muted/30 animate-pulse rounded" />
                ) : (
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatCurrency(result, toCurrency)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Exchange Rate Info */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Exchange Rate</p>
              <p className="text-lg font-semibold">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{getTimeSinceUpdate()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
