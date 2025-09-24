import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface ExchangeData {
  exchange: string;
  buyPrice: string;
  sellPrice: string;
  spread: string;
  volume24h: string;
  lastUpdate: string;
}

const exchangeData: ExchangeData[] = [
  {
    exchange: "Binance TH",
    buyPrice: "฿ 1,450,000",
    sellPrice: "฿ 1,451,500",
    spread: "0.10%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Binance TH",
    buyPrice: "฿ 1,449,500",
    sellPrice: "฿ 1,450,500",
    spread: "0.07%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Binance TH",
    buyPrice: "฿ 1,449,000",
    sellPrice: "฿ 1,449,500",
    spread: "0.03%",
    volume24h: "฿3,950,000,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Binance TH",
    buyPrice: "฿ 1,448,500",
    sellPrice: "฿ 1,449,000",
    spread: "0.03%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Binance TH",
    buyPrice: "฿ 1,448,000",
    sellPrice: "฿ 1,448,500",
    spread: "0.03%",
    volume24h: "฿420,365,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Bitzkup Pro",
    buyPrice: "฿ 1,447,500",
    sellPrice: "฿ 1,448,000",
    spread: "0.03%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Satang Pro",
    buyPrice: "฿ 1,447,000",
    sellPrice: "฿ 1,447,500",
    spread: "0.03%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Satang Pro",
    buyPrice: "฿ 1,446,500",
    sellPrice: "฿ 1,447,000",
    spread: "0.03%",
    volume24h: "฿3,950,000,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Bitkap",
    buyPrice: "฿ 1,446,000",
    sellPrice: "฿ 1,446,500",
    spread: "0.03%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Zipmex",
    buyPrice: "฿ 1,445,500",
    sellPrice: "฿ 1,446,000",
    spread: "0.03%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Coinex",
    buyPrice: "฿ 1,445,000",
    sellPrice: "฿ 1,445,500",
    spread: "0.03%",
    volume24h: "฿854,348,000",
    lastUpdate: "Details"
  },
  {
    exchange: "Zipmex",
    buyPrice: "฿ 1,444,500",
    sellPrice: "฿ 1,445,000",
    spread: "0.03%",
    volume24h: "฿179,799,000",
    lastUpdate: "Details"
  },
];

export function ExchangeTable() {
  return (
    <section className="bg-[#1a1b23] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl">BTC/THB Exchanges</h2>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
              Price List
            </Button>
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
              Order API
            </Button>
            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
              Market Spread
            </Button>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm mb-4">
          ฿ Updated every 5 seconds. Updated 09:42:04
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-700 text-gray-400 text-sm">
            <div>Exchange</div>
            <div>Buy Price</div>
            <div>Sell Price</div>
            <div>Spread</div>
            <div>24h Volume</div>
            <div></div>
          </div>
          
          {exchangeData.map((row, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-800 transition-colors">
              <div className="text-white">{row.exchange}</div>
              <div className="text-green-400">{row.buyPrice}</div>
              <div className="text-red-400">{row.sellPrice}</div>
              <div className="text-gray-300">{row.spread}</div>
              <div className="text-gray-300">{row.volume24h}</div>
              <div>
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-xs px-3 py-1">
                  Details
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 text-gray-400">
          <div className="inline-flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span>Real-time data</span>
          </div>
          <p className="text-sm">
            Prices automatically updated from official exchanges and sources for maximum accuracy
          </p>
        </div>
      </div>
    </section>
  );
}