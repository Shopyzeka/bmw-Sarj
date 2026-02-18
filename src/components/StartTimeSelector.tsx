import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface StartTimeSelectorProps {
  startTime: Date;
  onChange: (time: Date) => void;
}

export function StartTimeSelector({ startTime, onChange }: StartTimeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateStr = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Yarın';
    }
    return dateStr;
  };

  // Adjust time
  const adjustTime = (minutes: number) => {
    const newTime = new Date(startTime.getTime() + minutes * 60000);
    onChange(newTime);
  };

  // Adjust date
  const adjustDate = (days: number) => {
    const newTime = new Date(startTime);
    newTime.setDate(newTime.getDate() + days);
    onChange(newTime);
  };

  // Set to now
  const setToNow = () => {
    onChange(new Date());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Başlangıç Zamanı</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          {isExpanded ? 'Kapat' : 'Düzenle'}
        </button>
      </div>

      {/* Main Display */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{formatDate(startTime)}</p>
            <p className="text-lg font-bold text-white">{formatTime(startTime)}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => adjustTime(-30)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="-30 dk"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => adjustTime(30)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="+30 dk"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/30 space-y-4"
        >
          {/* Date Controls */}
          <div className="space-y-2">
            <span className="text-xs text-slate-500">Tarih</span>
            <div className="flex gap-2">
              <button
                onClick={() => adjustDate(-1)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                -1 Gün
              </button>
              <button
                onClick={setToNow}
                className="flex-1 py-2 px-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm transition-colors"
              >
                Şimdi
              </button>
              <button
                onClick={() => adjustDate(1)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                +1 Gün
              </button>
            </div>
          </div>

          {/* Quick Time Buttons */}
          <div className="space-y-2">
            <span className="text-xs text-slate-500">Hızlı Saat Seçimi</span>
            <div className="grid grid-cols-4 gap-2">
              {[0, 6, 12, 18, 20, 22, 23, 24].map((hour) => (
                <button
                  key={hour}
                  onClick={() => {
                    const newTime = new Date(startTime);
                    newTime.setHours(hour, 0, 0, 0);
                    onChange(newTime);
                  }}
                  className="py-2 px-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  {hour.toString().padStart(2, '0')}:00
                </button>
              ))}
            </div>
          </div>

          {/* Hour and Minute Sliders */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Saat</span>
                <span>{startTime.getHours().toString().padStart(2, '0')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="23"
                value={startTime.getHours()}
                onChange={(e) => {
                  const newTime = new Date(startTime);
                  newTime.setHours(parseInt(e.target.value));
                  onChange(newTime);
                }}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Dakika</span>
                <span>{startTime.getMinutes().toString().padStart(2, '0')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="59"
                step="5"
                value={startTime.getMinutes()}
                onChange={(e) => {
                  const newTime = new Date(startTime);
                  newTime.setMinutes(parseInt(e.target.value));
                  onChange(newTime);
                }}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
