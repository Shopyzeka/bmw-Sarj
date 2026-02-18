import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ChevronDown, ChevronUp, Battery, Zap, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChargeSession } from '@/types';

interface ChargeHistoryProps {
  sessions: ChargeSession[];
  onClear: () => void;
  onDelete: (id: string) => void;
}

export function ChargeHistory({ sessions, onClear, onDelete }: ChargeHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} dk`;
    return `${hours} sa ${mins} dk`;
  };

  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-5 rounded-2xl border border-dashed border-slate-700/50 bg-slate-900/30 text-center"
      >
        <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Henüz şarj kaydı yok</p>
        <p className="text-xs text-slate-600 mt-1">Hesaplamalarınız otomatik olarak kaydedilecek</p>
      </motion.div>
    );
  }

  const displayedSessions = isExpanded ? sessions : sessions.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-slate-900/50 border-slate-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Şarj Geçmişi</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
            {sessions.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Temizle
        </Button>
      </div>

      {/* Sessions List */}
      <div className="divide-y divide-slate-700/30">
        <AnimatePresence>
          {displayedSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-slate-800/30 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    session.chargeType === 'AC' 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {session.chargeType === 'AC' ? <Battery className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{session.modelName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.date)}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(session.duration)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{session.cost.toFixed(2)} TL</p>
                    <p className="text-[10px] text-slate-500">{session.energyAdded.toFixed(1)} kWh</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(session.id)}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less */}
      {sessions.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-400 hover:bg-slate-800/30 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Daha az göster
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {sessions.length - 3} kayıt daha
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
