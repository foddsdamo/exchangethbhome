import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calculator, Star, ExternalLink, TrendingUp, Clock, Shield, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from './components/ui/dialog';
import { Badge } from './components/ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { projectId, publicAnonKey } from './utils/supabase/info';

export default function App() {
  const [amount, setAmount] = useState('1');
  const [isOpenBitkubModalOpen, setIsOpenBitkubModalOpen] = useState(false);
  const [exchangeData, setExchangeData] = useState({
    buyPrice: 3430000,
    sellPrice: 3425000,
    tradingFee: 0.25,
    depositFee: 0,
    withdrawalFee: 0.0005,
    spread: 0.15,
    priceChange24h: 2.45,
    volume24h: 985440000,
    lastUpdated: '17:30:00'
  });
  const [exchangeInfo, setExchangeInfo] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c3bd47da`;

  // Initialize data and set up auto-refresh
  useEffect(() => {
    initializeData();
    const dataTimer = setInterval(fetchLatestData, 30000); // Refresh every 30 seconds
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => {
      clearInterval(dataTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const initializeData = async () => {
    try {
      // Initialize sample data
      await fetch(`${baseUrl}/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch all data
      await fetchLatestData();
    } catch (error) {
      console.log('Error initializing data:', error);
    }
  };

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      
      // Fetch price data
      const priceResponse = await fetch(`${baseUrl}/exchange/prices/Bitkub/BTC/THB`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        setExchangeData(prev => ({ ...prev, ...priceData.data }));
      }

      // Fetch exchange info
      const infoResponse = await fetch(`${baseUrl}/exchange/info/Bitkub`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        setExchangeInfo(infoData.data);
      }

      // Fetch price history
      const historyResponse = await fetch(`${baseUrl}/exchange/history/Bitkub/BTC/THB`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setPriceHistory(historyData.data || []);
      }
      
    } catch (error) {
      console.log('Error fetching latest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchLatestData();
  };

  // Calculate costs based on amount
  const calculateCosts = () => {
    const amountNum = parseFloat(amount) || 0;
    const buySubtotal = exchangeData.buyPrice * amountNum;
    const buyFee = buySubtotal * (exchangeData.tradingFee / 100);
    const buyTotal = buySubtotal + buyFee;
    const buyEffectivePrice = buyTotal / amountNum;

    const sellSubtotal = exchangeData.sellPrice * amountNum;
    const sellFee = sellSubtotal * (exchangeData.tradingFee / 100);
    const sellTotal = sellSubtotal - sellFee;
    const sellEffectivePrice = sellTotal / amountNum;

    return {
      buy: {
        subtotal: buySubtotal,
        fee: buyFee,
        total: buyTotal,
        effectivePrice: buyEffectivePrice
      },
      sell: {
        subtotal: sellSubtotal,
        fee: sellFee,
        total: sellTotal,
        effectivePrice: sellEffectivePrice
      }
    };
  };

  const costs = calculateCosts();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-500 rounded-lg p-2">
            <span className="text-white font-bold text-sm">TH</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">ExchangeTHB</h1>
            <p className="text-slate-400 text-sm">Compare crypto prices across Thai exchanges</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300">
            <Calculator className="w-4 h-4 mr-2" />
            Calculator
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm">🇹🇭 EN</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <ChevronLeft className="w-4 h-4 text-slate-400" />
          <div>
            <h2 className="text-2xl font-bold">Bitkub</h2>
            <p className="text-slate-400">BTC/THB Trading</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Current Prices */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">₿</span>
                </div>
                <h3 className="text-xl font-bold">Current Prices - BTC/THB</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-900/30 border border-green-800 rounded-lg p-4">
                  <div className="text-sm text-green-400 mb-1">Buy Price</div>
                  <div className="text-2xl font-bold text-green-400">฿{exchangeData.buyPrice.toLocaleString()}</div>
                  <div className="text-xs text-green-300">Best price for buying BTC</div>
                </div>

                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                  <div className="text-sm text-red-400 mb-1">Sell Price</div>
                  <div className="text-2xl font-bold text-red-400">฿{exchangeData.sellPrice.toLocaleString()}</div>
                  <div className="text-xs text-red-300">Best price for selling BTC</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-700">
                <div>
                  <div className="text-sm text-slate-400">Spread</div>
                  <div className="font-bold">{exchangeData.spread}%</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Price Change (24h)</div>
                  <div className={`font-bold ${exchangeData.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {exchangeData.priceChange24h > 0 ? '+' : ''}{exchangeData.priceChange24h}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Volume (24h)</div>
                  <div className="font-bold">฿{exchangeData.volume24h.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                <span>Last updated: {exchangeData.lastUpdated}</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live • {currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </Card>

            {/* Fees & Costs */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-6 bg-slate-600 rounded flex items-center justify-center">
                  <span className="text-xs">%</span>
                </div>
                <h3 className="text-xl font-bold">Fees & Costs</h3>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{exchangeData.tradingFee}%</div>
                  <div className="text-sm text-slate-400">Trading Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">Free</div>
                  <div className="text-sm text-slate-400">Deposit Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">{exchangeData.withdrawalFee} BTC</div>
                  <div className="text-sm text-slate-400">Withdrawal Fee</div>
                </div>
              </div>
            </Card>

            {/* Price Chart */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold">24H Price Chart</h3>
              </div>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={['dataMin - 10000', 'dataMax + 10000']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(value) => `฿${(value / 1000000).toFixed(1)}M`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Exchange Overview */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-6">Exchange Overview</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h4 className="font-bold text-green-400">Advantages</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {exchangeInfo?.advantages?.map((advantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{advantage}</span>
                      </li>
                    )) || [
                      'Licensed by SEC Thailand',
                      'Local THB support', 
                      'High liquidity',
                      '24/7 customer support',
                      'Strong security measures'
                    ].map((advantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <h4 className="font-bold text-red-400">Disadvantages</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {exchangeInfo?.disadvantages?.map((disadvantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{disadvantage}</span>
                      </li>
                    )) || [
                      'Higher fees compared to global exchanges',
                      'Limited altcoin selection',
                      'KYC verification required', 
                      'Limited trading features'
                    ].map((disadvantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Cost Calculator Sidebar */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Calculator className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold">Cost Calculator</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Amount (BTC)</label>
                  <Input 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                    type="number"
                    step="0.0001"
                    min="0"
                  />
                </div>

                {/* Buy Calculation */}
                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                  <div className="text-sm text-green-400 mb-2">Buy {amount} BTC</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Subtotal</span>
                      <span>฿{costs.buy.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Trading Fee ({exchangeData.tradingFee}%)</span>
                      <span>+ ฿{costs.buy.fee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-green-800 pt-2 flex justify-between font-bold text-green-400">
                      <span>Total Cost</span>
                      <span>฿{costs.buy.total.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-green-300">Effective Price: ฿{costs.buy.effectivePrice.toLocaleString()}</div>
                  </div>
                </div>

                {/* Sell Calculation */}
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <div className="text-sm text-red-400 mb-2">Sell {amount} BTC</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Subtotal</span>
                      <span>฿{costs.sell.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Trading Fee ({exchangeData.tradingFee}%)</span>
                      <span>- ฿{costs.sell.fee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-red-800 pt-2 flex justify-between font-bold text-red-400">
                      <span>You Receive</span>
                      <span>฿{costs.sell.total.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-red-300">Effective Price: ฿{costs.sell.effectivePrice.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Open Bitkub Modal */}
            <Dialog open={isOpenBitkubModalOpen} onOpenChange={setIsOpenBitkubModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Bitkub
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-200 text-slate-900 max-w-md">
                <div className="text-center space-y-6 p-6">
                  <div className="mx-auto w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">Open Bitkub</h3>
                    <p className="text-sm text-slate-600">You will be taken to the exchange's official website to complete your trade.</p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Bitkub
                    </Button>
                    <Button variant="outline" className="w-full">
                      Official Website
                    </Button>
                    <Button variant="ghost" className="w-full text-slate-500">
                      Continue on ExchangeTHB
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Market Depth */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold">Market Depth</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-400 mb-2">Buy Orders</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">฿3,428,000</span>
                      <span>2.5 BTC</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">฿3,427,000</span>
                      <span>1.8 BTC</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">฿3,426,000</span>
                      <span>3.2 BTC</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-700 pt-3">
                  <div className="text-xs text-slate-400 mb-2">Sell Orders</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400">฿3,430,000</span>
                      <span>1.5 BTC</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400">฿3,431,000</span>
                      <span>2.1 BTC</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400">฿3,432,000</span>
                      <span>0.9 BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Exchange Stats */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-4 h-4 text-purple-400" />
                <h4 className="font-bold">Exchange Statistics</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Founded</div>
                  <div className="font-bold">{exchangeInfo?.founded || '2018'}</div>
                </div>
                <div>
                  <div className="text-slate-400">Daily Users</div>
                  <div className="font-bold">{exchangeInfo?.users || '50K+'}</div>
                </div>
                <div>
                  <div className="text-slate-400">Supported Coins</div>
                  <div className="font-bold">{exchangeInfo?.supportedCoins || '50'}+</div>
                </div>
                <div>
                  <div className="text-slate-400">Countries</div>
                  <div className="font-bold">{exchangeInfo?.countries?.join(', ') || 'Thailand'}</div>
                </div>
              </div>
            </Card>

            {/* Compliance Rating */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Compliance Rating</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < (exchangeInfo?.complianceRating || 8) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-bold">{exchangeInfo?.complianceRating || 8}/10</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">SEC Thailand Licensed</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-slate-400">Security Features:</div>
                  <div className="space-y-1 text-xs">
                    {exchangeInfo?.securityFeatures?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    )) || [
                      'Cold storage for 98% of funds',
                      'Two-factor authentication',
                      'Insurance coverage'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-slate-500">
                  Information updated: 2025/9/1
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}