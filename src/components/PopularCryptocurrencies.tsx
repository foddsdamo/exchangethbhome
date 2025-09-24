import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoData {
  symbol: string;
  name: string;
  price: string;
  change: number;
  color: string;
}

const cryptoData: CryptoData[] = [
  { symbol: "BTC", name: "Bitcoin", price: "฿1,450,000", change: 2.5, color: "bg-orange-500" },
  { symbol: "BTC", name: "Bitcoin", price: "฿1,450,000", change: 2.5, color: "bg-orange-500" },
  { symbol: "BTC", name: "Bitcoin", price: "฿1,450,000", change: 2.5, color: "bg-orange-500" },
  { symbol: "BTC", name: "Bitcoin", price: "฿1,450,000", change: 2.5, color: "bg-teal-500" },
  { symbol: "BTC", name: "Bitcoin", price: "฿1,450,000", change: 2.5, color: "bg-orange-500" },
  { symbol: "ETH", name: "Ethereum", price: "฿85,000", change: -1.2, color: "bg-teal-500" },
];

export function PopularCryptocurrencies() {
  return (
    <section className="bg-[#1a1b23] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-xl mb-6 flex items-center">
          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
          Popular Cryptocurrencies
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cryptoData.map((crypto, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 ${crypto.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{crypto.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{crypto.symbol}</div>
                  <div className="text-gray-400 text-sm">{crypto.name}</div>
                </div>
              </div>
              
              <div className="text-white mb-1">{crypto.price}</div>
              <div className={`flex items-center text-sm ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(crypto.change)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}