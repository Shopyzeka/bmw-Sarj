import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Calculator, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

import { Header } from '@/components/Header';
import { ModelSelector } from '@/components/ModelSelector';
import { ChargeTypeSelector } from '@/components/ChargeTypeSelector';
import { PercentageSlider } from '@/components/PercentageSlider';
import { ACSettings } from '@/components/ACSettings';
import { DCSettings } from '@/components/DCSettings';
import { StartTimeSelector } from '@/components/StartTimeSelector';
import { ResultCard } from '@/components/ResultCard';
import { CostCalculator } from '@/components/CostCalculator';
import { CO2Comparison } from '@/components/CO2Comparison';
import { ChargeHistory } from '@/components/ChargeHistory';
import { SaveSessionDialog } from '@/components/SaveSessionDialog';

import { useCalculator } from '@/hooks/useCalculator';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { ChargeSession } from '@/types';

import './App.css';

// Global visitor counter key
const VISITOR_KEY = 'bmw-total-visitors';

function App() {
  const { state, selectedModel, startTimeDate, updateState, result } = useCalculator();
  const [sessions, setSessions] = useLocalStorage<ChargeSession[]>('bmw-charge-sessions', []);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  
  // Visitor counter - increments on each page load
  const [visitorCount] = useState(() => {
    const stored = localStorage.getItem(VISITOR_KEY);
    const count = stored ? parseInt(stored) : 1248;
    // Increment on each visit
    const newCount = count + 1;
    localStorage.setItem(VISITOR_KEY, newCount.toString());
    return newCount;
  });

  // Reset to defaults
  const handleReset = useCallback(() => {
    updateState('selectedModel', 'ix-xdrive50');
    updateState('chargeType', 'AC');
    updateState('currentPercentage', 20);
    updateState('targetPercentage', 80);
    updateState('amperage', 16);
    updateState('dcPower', 150);
    updateState('startTime', new Date().toISOString());
    toast.info('Ayarlar sıfırlandı');
  }, [updateState]);

  // Save session
  const handleSaveSession = useCallback(() => {
    if (result.duration === 0) {
      toast.error('Kaydedilecek bir şarj işlemi yok');
      return;
    }

    const newSession: ChargeSession = {
      id: Date.now().toString(),
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      chargeType: state.chargeType,
      startPercentage: state.currentPercentage,
      endPercentage: state.targetPercentage,
      energyAdded: result.energyNeeded,
      duration: result.duration,
      cost: result.cost,
      date: new Date().toISOString(),
    };

    setSessions(prev => [newSession, ...prev]);
    toast.success('Şarj işlemi kaydedildi');
    setIsSaveDialogOpen(false);
  }, [result, selectedModel, state, setSessions]);

  // Clear all sessions
  const handleClearSessions = useCallback(() => {
    setSessions([]);
    toast.info('Tüm kayıtlar silindi');
  }, [setSessions]);

  // Delete single session
  const handleDeleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.info('Kayıt silindi');
  }, [setSessions]);

  // Handle start time change
  const handleStartTimeChange = useCallback((newTime: Date) => {
    updateState('startTime', newTime.toISOString());
  }, [updateState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#0f172a',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            color: '#f1f5f9',
          },
        }}
      />
      
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Main Calculator Card */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Şarj Hesaplayıcı</h2>
                  <p className="text-xs text-slate-500">BMW elektrikli araçlar için şarj süresi hesaplama</p>
                </div>
              </div>

              {/* Model Selection */}
              <div className="mb-6">
                <ModelSelector
                  selectedModelId={state.selectedModel}
                  onSelect={(id) => updateState('selectedModel', id)}
                />
              </div>

              {/* Charge Type */}
              <div className="mb-6">
                <ChargeTypeSelector
                  value={state.chargeType}
                  onChange={(type) => updateState('chargeType', type)}
                />
              </div>

              {/* Percentage Sliders */}
              <div className="mb-6">
                <PercentageSlider
                  current={state.currentPercentage}
                  target={state.targetPercentage}
                  onCurrentChange={(val) => updateState('currentPercentage', val)}
                  onTargetChange={(val) => updateState('targetPercentage', val)}
                />
              </div>

              {/* AC/DC Settings */}
              <div className="mb-6">
                {state.chargeType === 'AC' ? (
                  <ACSettings
                    amperage={state.amperage}
                    onChange={(amp) => updateState('amperage', amp)}
                  />
                ) : (
                  <DCSettings
                    power={state.dcPower}
                    onChange={(power) => updateState('dcPower', power)}
                  />
                )}
              </div>

              {/* Start Time Selector */}
              <div className="mb-6">
                <StartTimeSelector
                  startTime={startTimeDate}
                  onChange={handleStartTimeChange}
                />
              </div>

              {/* Results */}
              <ResultCard result={result} chargeType={state.chargeType} />

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 h-12 rounded-xl border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Sıfırla
                </Button>
                <Button
                  onClick={() => setIsSaveDialogOpen(true)}
                  disabled={result.duration === 0}
                  className={`flex-1 h-12 rounded-xl ${
                    state.chargeType === 'AC'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-amber-500 hover:bg-amber-600'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats & History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Cost Calculator */}
            <CostCalculator
              energyNeeded={result.energyNeeded}
              electricityPrice={state.electricityPrice}
              onPriceChange={(price) => updateState('electricityPrice', price)}
            />

            {/* CO2 Comparison */}
            <CO2Comparison
              co2Saved={result.co2Saved}
              energyNeeded={result.energyNeeded}
            />

            {/* Charge History */}
            <ChargeHistory
              sessions={sessions}
              onClear={handleClearSessions}
              onDelete={handleDeleteSession}
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              © 2024 BMW Charge Calculator. BMW resmi bir ürünü değildir.
            </div>
            <div className="flex items-center gap-3">
              {/* Visitor Counter */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/50">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-slate-400">Ziyaretçi:</span>
                <span className="text-xs font-mono font-bold text-white">{visitorCount.toLocaleString('tr-TR')}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </footer>

      {/* Save Dialog */}
      <SaveSessionDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={handleSaveSession}
        model={selectedModel}
        chargeType={state.chargeType}
        currentPercentage={state.currentPercentage}
        targetPercentage={state.targetPercentage}
        result={result}
      />
    </div>
  );
}

export default App;
