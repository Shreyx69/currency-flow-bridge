import CurrencyConverter from "@/components/CurrencyConverter";
import { ArrowRightLeft } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <ArrowRightLeft className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Currency Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert currencies in real-time with live exchange rates
          </p>
        </div>

        {/* Converter */}
        <CurrencyConverter />

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Exchange rates are updated in real-time from reliable sources
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
