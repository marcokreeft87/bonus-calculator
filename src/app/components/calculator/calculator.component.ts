import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { IClientTab } from '../../models/client';
import { MatIconModule } from '@angular/material/icon';
import { IMonth } from '../../models/month';
import { ClientComponent } from '../client/client.component';
import { IApplicationData } from '../../models/application';
import { ApplicationService } from '../../services/application.service';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../services/client.service';
import { TotalComponent } from '../total/total.component';
import { Months } from '../../shared/const';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    ClientComponent,
    MatButtonModule,
    TotalComponent
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  @ViewChild(TotalComponent) totalComponent!: TotalComponent;

  clientTabs: IClientTab[];
  applicationData: IApplicationData;

  form: FormGroup; 

  constructor(
    fb: FormBuilder,
    private service: ApplicationService,
    clientService: ClientService
  ) {
    this.applicationData = service.getApplicationData();
    this.clientTabs = clientService.getClients();
    this.form = fb.group({
      grossMonthSalary: [this.applicationData.grossMonthSalary],
      baseRate: [this.applicationData.baseRate],
    });
  }

  addClientTab() {
    this.clientTabs.push({
      name: 'Nieuwe klant',
      months: this.createMonths()
    });
  }

  createMonths() : IMonth[] {
    return Months.map(month => {
      return {
        name: month,
        hours: 0
      };
    });
  }  

  updateClientTab(tab: IClientTab) {
    const index = this.clientTabs.indexOf(tab);
    this.clientTabs[index] = tab;

    this.totalComponent.refreshData(this.clientTabs);
  }

  save() {
    Object.assign(this.applicationData, this.form.value);
    
    this.service.saveApplicationData(this.applicationData);
  }
}
