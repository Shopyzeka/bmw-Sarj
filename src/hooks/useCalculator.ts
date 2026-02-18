import { useState, useCallback, useMemo } from 'react';
import { 
  BMW_MODELS, 
  DC_CHARGING_CURVE, 
  DEFAULT_ELECTRICITY_PRICE,
  CO2_PER_LITER_GASOLINE,
  AVG_CONSUMPTION_GASOLINE,
  AVG_CONSUMPTION_EV,
  type CalculatorState,
  type CalculationResult 
} from '@/types';

const VOLTAGE_AC = 220; 
const AC_EFFICIENCY = 0.90;
const DC_EFFICIENCY = 0.94;

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    selectedModel: 'ix-xdrive50',
    chargeType: 'AC',
    currentPercentage: 20,
    targetPercentage: 80,
    amperage: 16,
    phase: 1, // Varsayılan Monofaz
    dcPower: 150,
    electricityPrice: DEFAULT_ELECTRICITY_PRICE,
    startTime: new Date().toISOString(),
  });

  const selectedModel = useMemo(() => 
    BMW_MODELS.find(m => m.id === state.selectedModel) || BMW_MODELS[0],
    [state.selectedModel]
  );

  const updateState = useCallback(<K extends keyof CalculatorState>(
    key: K, 
    value: CalculatorState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const getDCPowerMultiplier = useCallback((percentage: number): number => {
    for (let i = DC_CHARGING_CURVE.length - 1; i >= 0; i--) {
      if (percentage >= DC_CHARGING_CURVE[i].soc) {
        return DC_CHARGING_CURVE[i].multiplier;
      }
    }
    return 1.0;
  }, []);

  const calculateResult = useCallback((): CalculationResult => {
    const { batteryCapacity, maxACPower, maxDCPower } = selectedModel;
    const { currentPercentage, targetPercentage, chargeType, amperage, phase, dcPower, electricityPrice, startTime } = state;

    if (targetPercentage <= currentPercentage) {
      return {
        energyNeeded: 0,
        grossPower: 0,
        netPower: 0,
        lossPower: 0,
        efficiency: chargeType === 'AC' ? AC_EFFICIENCY : DC_EFFICIENCY,
        duration: 0,
        finishTime: new Date(startTime),
        cost: 0,
        co2Saved: 0,
      };
    }

    const energyNeeded = ((targetPercentage - currentPercentage) / 100) * batteryCapacity;
    
    let grossPower = 0;
    let efficiency = AC_EFFICIENCY;

    if (chargeType === 'AC') {
      // Trifaz Hesaplaması: Amper * Volt * Faz Sayısı
      const calculatedPower = (amperage * VOLTAGE_AC * phase) / 1000; 
      grossPower = Math.min(calculatedPower, maxACPower);
    } else {
      const stationPower = Math.min(dcPower, maxDCPower);
      const avgMultiplier = (getDCPowerMultiplier(currentPercentage) + getDCPowerMultiplier(targetPercentage)) / 2;
      grossPower = stationPower * avgMultiplier;
      efficiency = DC_EFFICIENCY;
    }

    const netPower = grossPower * efficiency;
    const duration = Math.round((energyNeeded / netPower) * 60);
    
    const startDate = new Date(startTime);
    const finishTime = new Date(startDate.getTime() + duration * 60000);
    const cost = energyNeeded * electricityPrice;

    const evRange = (energyNeeded / AVG_CONSUMPTION_EV) * 100;
    const gasolineNeeded = (evRange / 100) * AVG_CONSUMPTION_GASOLINE;
    const co2Saved = gasolineNeeded * CO2_PER_LITER_GASOLINE;

    return {
      energyNeeded,
      grossPower,
      netPower,
      lossPower,
      efficiency,
      duration,
      finishTime,
      cost,
      co2Saved,
    };
  }, [selectedModel, state, getDCPowerMultiplier]);

  const result = useMemo(() => calculateResult(), [calculateResult]);
  const startTimeDate = useMemo(() => new Date(state.startTime), [state.startTime]);

  return {
    state,
    selectedModel,
    startTimeDate,
    updateState,
    result,
  };
}