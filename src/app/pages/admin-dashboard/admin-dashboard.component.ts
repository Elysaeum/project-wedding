import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WeddingService } from '../../shared/services/wedding.service';
import { Wedding } from '../../shared/models/Wedding';
import { ServiceLevel } from '../../shared/models/ServiceLevel';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DateFormatterPipe, ReactiveFormsModule, MatCardModule, MatInputModule, MatSelectModule, MatButtonModule, MatTableModule, MatIconModule, MatSortModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  title: string = 'Admin Dashboard - Esküvő felvitel';
  weddingForm!: FormGroup;
  isLoading = false;
  weddings: MatTableDataSource<Wedding> = new MatTableDataSource();
  displayedColumns: string[] = ['title', 'location', 'weddingDate', 'serviceLevel', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadWeddings();
  }

  initializeForm(): void {
    this.weddingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      weddingDate: [new Date(), Validators.required],
      serviceLevel: [ServiceLevel.Alap, Validators.required], // Enum használata
      description: ['', Validators.maxLength(200)],
      imageUrl: ['', Validators.required]
    });
  }

  loadWeddings(): void {
    this.weddingService.getAllWeddings().subscribe(weddings => {
      this.weddings = new MatTableDataSource(weddings);
    });
  }

  async addWedding(): Promise<void> {
    if (this.weddingForm.valid) {
      this.isLoading = true;
      const formValue = this.weddingForm.value;
      const newWedding: Omit<Wedding, 'id'> = {
        title: formValue.title,
        location: formValue.location,
        weddingDate: formValue.weddingDate,
        serviceLevel: formValue.serviceLevel,
        description: formValue.description,
        status: 'Elérhető',
        imageUrl: formValue.imageUrl,
        services: [formValue.serviceLevel]
      };

      try {
        const addedWedding = await this.weddingService.addWedding(newWedding);
        console.log('New wedding added', addedWedding);
        this.weddingForm.reset({
          serviceLevel: ServiceLevel.Alap,
          weddingDate: new Date(),
          imageUrl: ''
        });
      } catch (error) {
        console.error('Error adding wedding', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.weddingForm.controls).forEach(key => {
        const control = this.weddingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  editWedding(wedding: Wedding): void {
    this.weddingForm.patchValue(wedding);
  }

  resetWeddingStatus(wedding: Wedding): void {
    const newWeddingDate = prompt("Adj meg egy új dátumot:", wedding.weddingDate.toLocaleDateString());
    if (newWeddingDate) {
      const parsedDate = new Date(newWeddingDate);
      if (isNaN(parsedDate.getTime())) {
        alert('A dátum formátum nem érvényes!');
        return;
      }
      wedding.weddingDate = parsedDate;
      this.weddingService.updateWeddingStatus(wedding.id, 'Elérhető');
    }
  }

  async deleteWedding(weddingId: number): Promise<void> {
    this.isLoading = true;
    try {
      await this.weddingService.deleteWedding(weddingId);
      this.loadWeddings();
    } catch (error) {
      console.error('Error deleting wedding', error);
    } finally {
      this.isLoading = false;
    }
  }
}
