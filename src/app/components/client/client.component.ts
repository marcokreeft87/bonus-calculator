import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IClientTab } from '../../models/client';
import { MatCardModule } from '@angular/material/card';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../services/client.service';
import { IApplicationData } from '../../models/application';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  @Input() tab!: IClientTab;
  @Input() applicationData!: IApplicationData;
  @Output() updated = new EventEmitter<IClientTab>();
  
  form!: FormGroup;
  totalHours: number = 0;

  constructor(
    private fb: FormBuilder,
    private service: ClientService
  ) {}

  ngOnInit(): void {
    
    this.form = this.fb.group({
      name: this.tab.name,
      salesRate: this.tab.salesRate,
      baseRateDifference: (this.tab.salesRate ?? 0) - this.applicationData.baseRate,
      baseRateDifferencePercentage: this.calculateBaseRateDifferencePercentage(),
      months: this.fb.array(this.tab.months.map(month => {
        return this.fb.group({
          name: month.name,
          hours: month.hours
        });
      }))
    });

    this.calculateTotalHours();
  }

  getMonthControls() : FormArray {
    return this.form.get("months") as FormArray  
  }

  calculateBaseRateDifferencePercentage() {
    const salesRate = this.tab.salesRate ?? 0;
    const baseRate = this.applicationData.baseRate;

    return ((1 - (baseRate / salesRate)) / 2);
  }

  save() {
    Object.assign(this.tab, this.form.value);
    
    this.service.saveClient(this.tab);

    this.calculateTotalHours();

    this.updated.emit(this.tab);
  }

  calculateTotalHours() {
    this.totalHours = this.tab.months.reduce((total, month) => total + month.hours, 0);
  }
}
