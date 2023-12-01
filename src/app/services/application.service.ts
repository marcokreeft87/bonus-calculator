import { Injectable } from "@angular/core";
import { LocalStorageService } from "./localStorage.service";
import { IApplicationData } from "../models/application";

@Injectable({
    providedIn: 'root'
  })
export class ApplicationService extends LocalStorageService {
    key = 'application';

    getApplicationData() : IApplicationData {
        return this.getData(this.key) ? JSON.parse(this.getData(this.key)!) : { grossYearSalary: 0, baseRate: 0, internalHours: [] };
    }

    saveApplicationData(applicationData: IApplicationData): void {
        console.log(JSON.stringify(applicationData));
        this.saveData(this.key, JSON.stringify(applicationData));
    }
}