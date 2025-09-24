import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-[#1a1b23] border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white">ExchangeAPI</span>
          <span className="text-gray-400 text-sm">Real-time data from all major Thai exchanges</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-300 hover:text-white">
            Calculator
          </Button>
          <div className="flex items-center space-x-1 text-gray-300">
            <span>🇹🇭 TH</span>
          </div>
        </div>
      </div>
    </header>
  );
}