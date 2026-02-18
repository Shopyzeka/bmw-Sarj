import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp, TrendingDown, Battery, Sun, Moon } from 'lucide-react';
import type { CalculationResult } from '@/types';

interface ResultCardProps {
  result: CalculationResult;
  chargeType: 'AC' | 'DC';
}

export function ResultCard({ result, chargeType }: ResultCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Yarın';
    }
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0 dk';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} dk`;
    return `${hours} sa ${mins} dk`;
  };

  const isCharging = result.duration > 0;
  const mainColor = chargeType === 'AC' ? 'blue' : 'amber';
  
  // Determine if finish time is during day or night
  const finishHour = result.finishTime.getHours();
  const isDaytime = finishHour >= 6 && finishHour < 18;

  return (
    <div className="space-y-4">
      {/* Main Results */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative overflow-hidden p-5 rounded-2xl border bg-gradient-to-br ${
            chargeType === 'AC' 
              ? 'from-blue-500/20 to-blue-600/5 border-blue-500/30' 
              : 'from-amber-500/20 to-amber-600/5 border-amber-500/30'
          }`}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              {isDaytime ? (
                <Sun className={`w-4 h-4 text-${mainColor}-400`} />
              ) : (
                <Moon className={`w-4 h-4 text-${mainColor}-400`} />
              )}
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Tahmini Bitiş</span>
            </div>
            <motion.div
              key={result.finishTime.getTime()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className={`text-3xl font-black text-${mainColor}-400`}>
                {isCharging ? formatTime(result.finishTime) : '--:--'}
              </p>
              {isCharging && (
                <p className="text-sm text-slate-400 mt-1">
                  {formatDate(result.finishTime)}
                </p>
              )}
            </motion.div>
          </div>
          {isCharging && (
            <motion.div
              className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${mainColor}-500/20 rounded-full blur-2xl`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden p-5 rounded-2xl border bg-slate-900/50 border-slate-700/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Şarj Süresi</span>
          </div>
          <motion.p 
            key={result.duration}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {formatDuration(result.duration)}
          </motion.p>
        </motion.div>
      </div>

      {/* Technical Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl border bg-slate-900/50 border-slate-700/50 space-y-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Teknik Detaylar</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatRow
            label="Brüt Güç"
            value={`${result.grossPower.toFixed(2)} kW`}
            icon={<TrendingUp className="w-3 h-3" />}
            color="slate"
          />
          <StatRow
            label="Net Güç"
            value={`${result.netPower.toFixed(2)} kW`}
            icon={<TrendingUp className="w-3 h-3" />}
            color="green"
          />
          <StatRow
            label="Kayıp Güç"
            value={`-${result.lossPower.toFixed(2)} kW`}
            icon={<TrendingDown className="w-3 h-3" />}
            color="red"
          />
          <StatRow
            label="Enerji"
            value={`${result.energyNeeded.toFixed(1)} kWh`}
            icon={<Battery className="w-3 h-3" />}
            color="blue"
          />
        </div>

        {/* Efficiency Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Sistem Verimliliği</span>
            <span className={`text-xs font-bold text-${mainColor}-400`}>
              %{(result.efficiency * 100).toFixed(0)}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.efficiency * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${
                chargeType === 'AC' 
                  ? 'from-blue-500 to-blue-400' 
                  : 'from-amber-500 to-amber-400'
              }`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'slate' | 'green' | 'red' | 'blue';
}

function StatRow({ label, value, icon, color }: StatRowProps) {
  const colorClasses = {
    slate: 'text-slate-400 bg-slate-800/50',
    green: 'text-emerald-400 bg-emerald-500/10',
    red: 'text-red-400 bg-red-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30">
      <div className="flex items-center gap-2">
        <span className={`p-1 rounded ${colorClasses[color]}`}>{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <span className="text-sm font-mono font-semibold text-slate-200">{value}</span>
    </div>
  );
}
