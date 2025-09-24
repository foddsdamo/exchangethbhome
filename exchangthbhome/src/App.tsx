import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { PopularCryptocurrencies } from "./components/PopularCryptocurrencies";
import { ExchangeTable } from "./components/ExchangeTable";
import { Features } from "./components/Features";

export default function App() {
  return (
    <div className="min-h-screen bg-[#1a1b23]">
      <Header />
      <HeroSection />
      <PopularCryptocurrencies />
      <ExchangeTable />
      <Features />
    </div>
  );
}