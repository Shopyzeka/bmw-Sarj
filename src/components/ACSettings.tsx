import { motion } from 'framer-motion';
import { Zap, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ACSettingsProps {
  amperage: number;
  onChange: (amperage: number) => void;
}

// 6-16 arası 1'er amper, 16-32 arası 4'er amper
const generateAmperageOptions = () => {
  const options = [];
  // 6A'dan 16A'ye kadar 1'er amper
  for (let i = 6; i <= 16; i++) {
    const power = ((i * 220) / 1000).toFixed(1);
    options.push({ value: i, label: `${i}A`, power: `${power} kW`, phase: '1 Faz' });
  }
  // 16A'dan 32A'ye kadar 4'er amper
  for (let i = 20; i <= 32; i += 4) {
    const power = ((i * 220) / 1000).toFixed(1);
    options.push({ value: i, label: `${i}A`, power: `${power} kW`, phase: '1 Faz' });
  }
  return options;
};

const AMPERAGE_OPTIONS = generateAmperageOptions();

export function ACSettings({ amperage, onChange }: ACSettingsProps) {
  const selectedOption = AMPERAGE_OPTIONS.find(o => o.value === amperage) || AMPERAGE_OPTIONS[10]; // Default 16A

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Şebeke Akımı</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-500 hover:text-slate-400 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">Türkiye'de ev tipi şarj istasyonları tek faz (220V) çalışır. 16A'ye kadar 1'er, sonrasında 4'er amper artar.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {AMPERAGE_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-2 rounded-xl border transition-all ${
              amperage === option.value
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:border-slate-600/50'
            }`}
          >
            <div className="text-sm font-bold">{option.label}</div>
            <div className="text-[9px] opacity-70 mt-0.5">{option.power}</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={selectedOption.value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20"
      >
        <span className="text-xs text-blue-400">Seçilen Güç</span>
        <span className="text-sm font-bold text-blue-400">{selectedOption.power} (220V {selectedOption.phase})</span>
      </motion.div>
    </div>
  );
}
