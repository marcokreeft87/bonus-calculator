import { IMonth } from "./month";

export interface IApplicationData {
    grossMonthSalary: number;
    baseRate: number;
    internalHours: IMonth[];
}