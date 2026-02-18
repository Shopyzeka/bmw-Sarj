import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, Info, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CostCalculatorProps {
  energyNeeded: number;
  electricityPrice: number;
  onPriceChange: (price: number) => void;
}

export function CostCalculator({ energyNeeded, electricityPrice, onPriceChange }: CostCalculatorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(electricityPrice.toString());

  const cost = energyNeeded * electricityPrice;
  const avgGasolineCost = energyNeeded * 8; // Rough estimate: 1 kWh ≈ 8 TL worth of gasoline
  const savings = avgGasolineCost - cost;

  const handleSave = () => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onPriceChange(newPrice);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempPrice(electricityPrice.toString());
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maliyet Analizi</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-500 hover:text-slate-400 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">Benzin maliyeti yaklaşık olarak hesaplanmıştır.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Elektrik Maliyeti</p>
          <motion.p 
            key={cost}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-emerald-400"
          >
            {cost.toFixed(2)} <span className="text-sm font-medium">TL</span>
          </motion.p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Benzin Maliyeti</p>
          <motion.p 
            key={avgGasolineCost}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-slate-400"
          >
            ~{avgGasolineCost.toFixed(0)} <span className="text-sm font-medium">TL</span>
          </motion.p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-400">Tasarruf</span>
        </div>
        <motion.span 
          key={savings}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-lg font-bold text-emerald-400"
        >
          {savings.toFixed(2)} TL
        </motion.span>
      </div>

      {/* Electricity Price Editor */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Birim Fiyat (TL/kWh)</span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              className="w-20 h-8 text-right text-sm bg-slate-800 border-slate-700"
              autoFocus
            />
            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400" onClick={handleSave}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <span className="font-mono">{electricityPrice.toFixed(2)} TL</span>
            <Edit2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
