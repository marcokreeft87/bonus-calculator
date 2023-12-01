import { IMonth } from "./month";

export interface IClientTab {
    id?: number;
    name: string;
    months: IMonth[];
    salesRate?: number;
    baseRateDifference?: number;
    baseRateDifferencePercentage?: number;
}