import { motion } from 'framer-motion';
import { Leaf, TreePine, Car, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CO2ComparisonProps {
  co2Saved: number;
  energyNeeded: number;
}

export function CO2Comparison({ co2Saved }: CO2ComparisonProps) {
  // Calculate equivalent metrics
  const treesNeeded = Math.ceil(co2Saved / 20); // A tree absorbs ~20kg CO2 per year
  const kmDriven = Math.round((co2Saved / 2.3) * 10); // Average car emits ~2.3kg CO2 per 10km

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border bg-gradient-to-br from-green-500/10 to-emerald-600/5 border-green-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Çevresel Etki</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-slate-500 hover:text-slate-400 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">Benzinli araçla karşılaştırıldığında bu şarj işlemi ile kazanılan CO2 tasarrufu.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main CO2 Saved */}
      <div className="text-center mb-5">
        <motion.div
          key={co2Saved}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex flex-col items-center"
        >
          <span className="text-4xl font-black text-green-400">{co2Saved.toFixed(2)}</span>
          <span className="text-sm text-green-400/80 font-medium">kg CO₂ Tasarrufu</span>
        </motion.div>
      </div>

      {/* Equivalencies */}
      <div className="grid grid-cols-2 gap-3">
        <EquivalenceCard
          icon={<TreePine className="w-5 h-5" />}
          value={treesNeeded}
          unit="ağaç"
          description="yıllık emilim"
          color="green"
        />
        <EquivalenceCard
          icon={<Car className="w-5 h-5" />}
          value={kmDriven}
          unit="km"
          description="benzinli araç"
          color="amber"
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-green-500/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Temiz Enerji Kullanımı</span>
          <span className="text-xs font-bold text-green-400">100%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

interface EquivalenceCardProps {
  icon: React.ReactNode;
  value: number;
  unit: string;
  description: string;
  color: 'green' | 'amber';
}

function EquivalenceCard({ icon, value, unit, description, color }: EquivalenceCardProps) {
  const colorClasses = {
    green: 'from-green-500/20 to-green-600/5 border-green-500/20 text-green-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="p-2 rounded-lg bg-slate-900/50">{icon}</div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{value}</span>
          <span className="text-xs">{unit}</span>
        </div>
        <span className="text-[10px] opacity-70">{description}</span>
      </div>
    </div>
  );
}
