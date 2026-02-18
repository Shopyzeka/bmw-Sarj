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

const VISITOR_KEY = 'bmw-total-visitors';

function App() {
  const { state, selectedModel, startTimeDate, updateState, result } = useCalculator();
  const [sessions, setSessions] = useLocalStorage<ChargeSession[]>('bmw-charge-sessions', []);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  
  const [visitorCount] = useState(() => {
    const stored = localStorage.getItem(VISITOR_KEY);
    const count = stored ? parseInt(stored) : 1248;
    const newCount = count + 1;
    localStorage.setItem(VISITOR_KEY, newCount.toString());
    return newCount;
  });

  const handleReset = useCallback(() => {
    updateState('selectedModel', 'ix-xdrive50');
    updateState('chargeType', 'AC');
    updateState('currentPercentage', 20);
    updateState('targetPercentage', 80);
    updateState('amperage', 16);
    updateState('phase', 1);
    updateState('dcPower', 150);
    updateState('startTime', new Date().toISOString());
    toast.info('Ayarlar sıfırlandı');
  }, [updateState]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Toaster position="top-center" />
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Şarj Hesaplayıcı</h2>
              </div>

              <ModelSelector selectedModelId={state.selectedModel} onSelect={(id) => updateState('selectedModel', id)} />
              <div className="my-6">
                <ChargeTypeSelector value={state.chargeType} onChange={(type) => updateState('chargeType', type)} />
              </div>
              <PercentageSlider
                current={state.currentPercentage}
                target={state.targetPercentage}
                onCurrentChange={(val) => updateState('currentPercentage', val)}
                onTargetChange={(val) => updateState('targetPercentage', val)}
              />

              <div className="my-6">
                {state.chargeType === 'AC' ? (
                  <ACSettings
                    amperage={state.amperage}
                    phase={state.phase}
                    onAmperageChange={(amp) => updateState('amperage', amp)}
                    onPhaseChange={(p) => updateState('phase', p)}
                  />
                ) : (
                  <DCSettings power={state.dcPower} onChange={(power) => updateState('dcPower', power)} />
                )}
              </div>

              <StartTimeSelector startTime={startTimeDate} onChange={(time) => updateState('startTime', time.toISOString())} />
              <ResultCard result={result} chargeType={state.chargeType} />

             <div className="flex gap-3 mt-6">
  <Button variant="outline" onClick={handleReset} className="flex-1 rounded-xl">
    <RotateCcw className="w-4 h-4 mr-2" /> {/* Kullanılmayan RotateCcw buraya eklendi */}
    Sıfırla
  </Button>
  <Button onClick={() => setIsSaveDialogOpen(true)} className="flex-1 rounded-xl bg-blue-600">
    <Save className="w-4 h-4 mr-2" /> {/* Kullanılmayan Save buraya eklendi */}
    Kaydet
  </Button>
</div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <CostCalculator energyNeeded={result.energyNeeded} electricityPrice={state.electricityPrice} onPriceChange={(p) => updateState('electricityPrice', p)} />
            <CO2Comparison co2Saved={result.co2Saved} energyNeeded={result.energyNeeded} />
            <ChargeHistory sessions={sessions} onClear={() => setSessions([])} onDelete={(id) => setSessions(prev => prev.filter(s => s.id !== id))} />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/50 mt-12 py-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-400">Ziyaretçi: {visitorCount.toLocaleString('tr-TR')}</span>
        </div>
      </footer>

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