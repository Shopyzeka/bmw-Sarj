import { motion } from 'framer-motion';
import { Home, Zap } from 'lucide-react';

interface ChargeTypeSelectorProps {
  value: 'AC' | 'DC';
  onChange: (type: 'AC' | 'DC') => void;
}

export function ChargeTypeSelector({ value, onChange }: ChargeTypeSelectorProps) {
  return (
    <div className="relative flex p-1.5 bg-slate-900/80 rounded-2xl border border-slate-700/50">
      <motion.div
        className="absolute inset-y-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500"
        initial={false}
        animate={{
          left: value === 'AC' ? '6px' : '50%',
          width: 'calc(50% - 6px)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
      
      <button
        onClick={() => onChange('AC')}
        className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors z-10 ${
          value === 'AC' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        <Home className="w-4 h-4" />
        AC (Ev/İş)
      </button>
      
      <button
        onClick={() => onChange('DC')}
        className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors z-10 ${
          value === 'DC' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        <Zap className="w-4 h-4" />
        DC (Hızlı)
      </button>
    </div>
  );
}
