import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Check, Battery, Zap, Clock, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalculationResult, BMWModel } from '@/types';

interface SaveSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  model: BMWModel;
  chargeType: 'AC' | 'DC';
  currentPercentage: number;
  targetPercentage: number;
  result: CalculationResult;
}

export function SaveSessionDialog({
  isOpen,
  onClose,
  onSave,
  model,
  chargeType,
  currentPercentage,
  targetPercentage,
  result,
}: SaveSessionDialogProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave();
    setIsSaving(false);
    onClose();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} dk`;
    return `${hours} sa ${mins} dk`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="mx-4 p-6 rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    chargeType === 'AC' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Save className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Şarj Kaydet</h3>
                    <p className="text-xs text-slate-500">Bu şarj işlemini geçmişe kaydet</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <SummaryRow
                  icon={<Battery className="w-4 h-4" />}
                  label="Araç"
                  value={model.name}
                  color="slate"
                />
                <SummaryRow
                  icon={chargeType === 'AC' ? <Battery className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  label="Şarj Tipi"
                  value={`${chargeType} (%${currentPercentage} → %${targetPercentage})`}
                  color={chargeType === 'AC' ? 'blue' : 'amber'}
                />
                <SummaryRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Süre"
                  value={formatDuration(result.duration)}
                  color="slate"
                />
                <SummaryRow
                  icon={<Wallet className="w-4 h-4" />}
                  label="Maliyet"
                  value={`${result.cost.toFixed(2)} TL`}
                  color="emerald"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 h-12 rounded-xl ${
                    chargeType === 'AC'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-amber-500 hover:bg-amber-600'
                  } text-white`}
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Kaydet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'slate' | 'blue' | 'amber' | 'emerald';
}

function SummaryRow({ icon, label, value, color }: SummaryRowProps) {
  const colorClasses = {
    slate: 'text-slate-400 bg-slate-800/50',
    blue: 'text-blue-400 bg-blue-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
      <div className="flex items-center gap-3">
        <span className={`p-1.5 rounded-lg ${colorClasses[color]}`}>{icon}</span>
        <span className="text-sm text-slate-400">{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-200">{value}</span>
    </div>
  );
}
