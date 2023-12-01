import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Factors, HoursThresholds, Months } from '../../shared/const';
import { MatTableModule } from '@angular/material/table';
import { IClientTab } from '../../models/client';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IApplicationData } from '../../models/application';
import { MatButtonModule } from '@angular/material/button';
import { IMonth } from '../../models/month';
import { ApplicationService } from '../../services/application.service';
import { MatIconModule } from '@angular/material/icon';
import { IMonthTotal } from '../../models/month-total';
import { IFactorData } from '../../models/factor';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class TotalComponent implements OnInit {  
  @Input() clients!: IClientTab[];
  @Input() applicationData!: IApplicationData;
  internalHours!: IMonth[];

  form!: FormGroup;
  months = Months;
  dataSource: IMonthTotal[] = [];
  factorDatasource: IFactorData[] = [];

  displayedColumns: string[] = ['name', 'external', 'internal'];
  hoursColumns: string[] = ['check', 'factor', 'threshold', 'earnings', 'client-earnings', 'subtotal'];

  constructor(
    private fb: FormBuilder,
    private service: ApplicationService
  ) { }

  ngOnInit(): void {
    this.refreshData(this.clients);
  }

  public refreshData(clients: IClientTab[]) {
    this.form = this.fb.group({});

    this.months.forEach(month => {
      this.form.addControl(month, this.fb.control(this.applicationData.internalHours?.find(m => m.name === month)!.hours));
    });

    this.dataSource = this.months.map(month => {
      return {
        name: month,
        external: clients?.reduce((acc, client) => {
          return acc + (client.months.find(m => m.name === month)?.hours || 0);
        }, 0),
        internal: this.applicationData.internalHours?.find(m => m.name === month)?.hours
      };
    });

    this.factorDatasource = HoursThresholds.map((element, index) => {
      return { 
        threshold: element, 
        factor: Factors[index], 
        earnings: this.applicationData.grossYearSalary * Factors[index],
        clientEarnings: 0,
        clientHours: 0
      };
    });

    this.calculateClientEarnings();
  }

  save() {
    this.applicationData.internalHours = [];

    Object.keys(this.form.value).forEach(key => {
      this.applicationData.internalHours.push({ name: key, hours: this.form.value[key] });
    });

    this.service.saveApplicationData(this.applicationData);
  }

  calculateClientEarnings() {

    this.clients.forEach(client => {
      const clientHours = client.months.reduce((acc, month) => acc + month.hours, 0);
      const clientHoursPercentage = clientHours / this.getTotalHours();

      this.factorDatasource.forEach((element, index) => {
        element.clientHours += clientHours;
        element.clientEarnings += (clientHoursPercentage * element.earnings) * client.baseRateDifferencePercentage!;
        element.subtotal = element.clientEarnings + element.earnings;
      });

    });

    this.factorDatasource.forEach(element => {      
      element.thresholdMet = this.getTotalHours() >= element.threshold;
    });

    const thresholdMetEntries = this.factorDatasource.filter(entry => entry.thresholdMet === true);
    const lastEntry = thresholdMetEntries[thresholdMetEntries.length - 1];
    lastEntry.selected = true;
  }

  getTotalExternal() {
    return this.dataSource.reduce((acc, month) => acc + month.external, 0);
  }

  getTotalInternal() {
    return this.dataSource.reduce((acc, month) => acc + (month.internal || 0), 0);
  }

  getTotalHours() {
    return this.getTotalExternal() + this.getTotalInternal();
  }
}
