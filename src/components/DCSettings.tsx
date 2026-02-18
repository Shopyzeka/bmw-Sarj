import { motion } from 'framer-motion';
import { Zap, Gauge, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DCSettingsProps {
  power: number;
  onChange: (power: number) => void;
}

const DC_OPTIONS = [
  { value: 50, label: '50 kW', type: 'Standart', icon: '🔌' },
  { value: 100, label: '100 kW', type: 'Hızlı', icon: '⚡' },
  { value: 150, label: '150 kW', type: 'Ultra', icon: '🔋' },
  { value: 200, label: '200 kW', type: 'Super', icon: '🚀' },
  { value: 250, label: '250 kW', type: 'Hyper', icon: '⚡⚡' },
  { value: 350, label: '350 kW', type: 'Max', icon: '🔥' },
];

export function DCSettings({ power, onChange }: DCSettingsProps) {
  const selectedOption = DC_OPTIONS.find(o => o.value === power) || DC_OPTIONS[2];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">İstasyon Gücü</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-500 hover:text-slate-400 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">DC hızlı şarj istasyonları doğru akım ile doğrudan bataryaya güç verir. %80&apos;den sonra şarj hızı düşer.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {DC_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-3 rounded-xl border transition-all ${
              power === option.value
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:border-slate-600/50'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-lg">{option.icon}</span>
              <Zap className={`w-3 h-3 ${power === option.value ? 'text-amber-400' : 'text-slate-500'}`} />
            </div>
            <div className="text-sm font-bold">{option.label}</div>
            <div className="text-[10px] opacity-70">{option.type}</div>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={selectedOption.value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/20"
      >
        <span className="text-xs text-amber-400">Seçilen Güç</span>
        <span className="text-sm font-bold text-amber-400">{selectedOption.label} - {selectedOption.type}</span>
      </motion.div>
    </div>
  );
}
