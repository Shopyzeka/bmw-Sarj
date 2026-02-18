import { BMW_MODELS } from '@/types';
import { Car, Battery, Zap, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelect: (modelId: string) => void;
}

export function ModelSelector({ selectedModelId, onSelect }: ModelSelectorProps) {
  const selectedModel = BMW_MODELS.find(m => m.id === selectedModelId) || BMW_MODELS[0];

  return (
    <div className="space-y-4">
      <div className="relative">
        <select
          value={selectedModelId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none bg-slate-900/80 border border-slate-700/50 rounded-2xl px-5 py-4 pr-12 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer hover:bg-slate-800/80"
        >
          {BMW_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <Car className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedModel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <SpecCard
            icon={<Battery className="w-4 h-4" />}
            value={`${selectedModel.batteryCapacity}`}
            unit="kWh"
            label="Batarya"
            color="blue"
          />
          <SpecCard
            icon={<Zap className="w-4 h-4" />}
            value={`${selectedModel.maxDCPower}`}
            unit="kW"
            label="Max DC"
            color="amber"
          />
          <SpecCard
            icon={<Route className="w-4 h-4" />}
            value={`${selectedModel.wltpRange}`}
            unit="km"
            label="Menzil"
            color="green"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface SpecCardProps {
  icon: React.ReactNode;
  value: string;
  unit: string;
  label: string;
  color: 'blue' | 'amber' | 'green';
}

function SpecCard({ icon, value, unit, label, color }: SpecCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
  };

  return (
    <div className={`relative overflow-hidden rounded-xl p-3 border bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1 opacity-80">
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-xs opacity-70">{unit}</span>
      </div>
    </div>
  );
}
