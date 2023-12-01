export interface IFactorData {
    threshold: number;
    factor: number;
    earnings: number;
    clientEarnings: number;
    clientHours: number;
    subtotal?: number;
    thresholdMet?: boolean;
    selected?: boolean;
}