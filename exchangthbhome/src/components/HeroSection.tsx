import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-[#1a1b23] px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl text-white mb-6 max-w-3xl mx-auto leading-tight">
          Compare Crypto Prices Across Thai Exchanges
        </h1>
        
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Find the best buy and sell prices for your cryptocurrency trades. Real-time data from all 
          major Thai exchanges.
        </p>
        
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input 
            className="bg-gray-800 border-gray-700 text-white pl-10 py-3"
            placeholder="Search cryptocurrency (BTC, ETH, ADA, ...)"
          />
        </div>
      </div>
    </section>
  );
}