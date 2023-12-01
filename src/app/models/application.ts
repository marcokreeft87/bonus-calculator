import { IMonth } from "./month";

export interface IApplicationData {
    grossYearSalary: number;
    baseRate: number;
    internalHours: IMonth[];
}