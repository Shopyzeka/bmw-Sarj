// BMW EV Types

export interface BMWModel {
  id: string;
  name: string;
  batteryCapacity: number; // kWh
  maxACPower: number; // kW
  maxDCPower: number; // kW
  wltpRange: number; // km
  chargingCurve?: number[]; // DC charging curve percentages
}

export interface ChargeSession {
  id: string;
  modelId: string;
  modelName: string;
  chargeType: 'AC' | 'DC';
  startPercentage: number;
  endPercentage: number;
  energyAdded: number; // kWh
  duration: number; // minutes
  cost: number; // TL
  date: string;
}

export interface CalculatorState {
  selectedModel: string;
  chargeType: 'AC' | 'DC';
  currentPercentage: number;
  targetPercentage: number;
  amperage: number;
  dcPower: number;
  electricityPrice: number; // TL/kWh
  startTime: string; // ISO string
}

export interface CalculationResult {
  energyNeeded: number; // kWh
  grossPower: number; // kW
  netPower: number; // kW
  lossPower: number; // kW
  efficiency: number; // percentage
  duration: number; // minutes
  finishTime: Date;
  cost: number; // TL
  co2Saved: number; // kg (compared to gasoline)
}

export const BMW_MODELS: BMWModel[] = [
  { id: 'ix1-edrive20', name: 'BMW iX1 eDrive20', batteryCapacity: 64.7, maxACPower: 11, maxDCPower: 130, wltpRange: 430 },
  { id: 'ix1', name: 'BMW iX1 xDrive30', batteryCapacity: 64.7, maxACPower: 11, maxDCPower: 130, wltpRange: 440 },
  { id: 'ix3', name: 'BMW iX3', batteryCapacity: 80, maxACPower: 11, maxDCPower: 150, wltpRange: 461 },
  { id: 'i4-edrive35', name: 'BMW i4 eDrive35', batteryCapacity: 70.2, maxACPower: 11, maxDCPower: 180, wltpRange: 490 },
  { id: 'i4-edrive40', name: 'BMW i4 eDrive40', batteryCapacity: 83.9, maxACPower: 11, maxDCPower: 200, wltpRange: 590 },
  { id: 'i4-m50', name: 'BMW i4 M50', batteryCapacity: 83.9, maxACPower: 11, maxDCPower: 200, wltpRange: 520 },
  { id: 'ix-xdrive40', name: 'BMW iX xDrive40', batteryCapacity: 76.6, maxACPower: 11, maxDCPower: 150, wltpRange: 425 },
  { id: 'ix-xdrive50', name: 'BMW iX xDrive50', batteryCapacity: 111.5, maxACPower: 22, maxDCPower: 195, wltpRange: 630 },
  { id: 'ix-m60', name: 'BMW iX M60', batteryCapacity: 111.5, maxACPower: 22, maxDCPower: 195, wltpRange: 566 },
  { id: 'i7-xdrive60', name: 'BMW i7 xDrive60', batteryCapacity: 101.7, maxACPower: 22, maxDCPower: 195, wltpRange: 625 },
  { id: 'i7-m70', name: 'BMW i7 M70 xDrive', batteryCapacity: 101.7, maxACPower: 22, maxDCPower: 195, wltpRange: 488 },
  { id: 'i5-edrive40', name: 'BMW i5 eDrive40', batteryCapacity: 81.2, maxACPower: 11, maxDCPower: 205, wltpRange: 582 },
  { id: 'i5-m60', name: 'BMW i5 M60 xDrive', batteryCapacity: 81.2, maxACPower: 11, maxDCPower: 205, wltpRange: 516 },
  { id: 'i3-120ah', name: 'BMW i3 120Ah', batteryCapacity: 42.2, maxACPower: 11, maxDCPower: 50, wltpRange: 308 },
];

export const DC_CHARGING_CURVE = [
  { soc: 0, multiplier: 1.0 },
  { soc: 10, multiplier: 1.0 },
  { soc: 20, multiplier: 1.0 },
  { soc: 30, multiplier: 1.0 },
  { soc: 40, multiplier: 1.0 },
  { soc: 50, multiplier: 0.95 },
  { soc: 60, multiplier: 0.85 },
  { soc: 70, multiplier: 0.70 },
  { soc: 80, multiplier: 0.50 },
  { soc: 90, multiplier: 0.25 },
  { soc: 100, multiplier: 0.10 },
];

export const DEFAULT_ELECTRICITY_PRICE = 2.5; // TL/kWh
export const GASOLINE_PRICE = 40; // TL/L
export const AVG_CONSUMPTION_GASOLINE = 8; // L/100km
export const AVG_CONSUMPTION_EV = 18; // kWh/100km
export const CO2_PER_LITER_GASOLINE = 2.3; // kg CO2 per liter
