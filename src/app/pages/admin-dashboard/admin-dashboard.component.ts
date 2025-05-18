import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { DateFormatterPipe } from '../../shared/pipes/date-formatter.pipe';

import { WeddingService } from '../../shared/services/wedding.service';
import { Wedding } from '../../shared/models/Wedding';
import { Service } from '../../shared/models/Service';
import { ServiceLevel } from '../../shared/models/ServiceLevel';
import { WeddingLocation } from '../../shared/models/WeddingLocation';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateFormatterPipe,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  weddingForm!: FormGroup;
  locationForm!: FormGroup;
  serviceForm!: FormGroup;
  isLoading = false;
  weddings = new MatTableDataSource<Wedding>();
  displayedColumns = ['title', 'location', 'weddingDate', 'serviceLevel', 'status', 'actions'];
  locations: WeddingLocation[] = [];
  services: Service[] = [];
  editingWeddingId: string | null = null;
  editingLocationId: string | null = null;
  editingServiceId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private weddingService: WeddingService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeForm();
    await this.loadInitialData();
  }

  initializeForm(): void {
    this.weddingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      weddingDate: [new Date(), Validators.required],
      serviceLevel: [{ value: ServiceLevel.Alap, disabled: true }, Validators.required],
      services: [[], Validators.required],
      description: ['', Validators.maxLength(200)],
      imageUrl: ['', Validators.required]
    });

    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true]
    });
  }

  async loadInitialData(): Promise<void> {
    this.isLoading = true;
    try {
      const [weddings, locations, services] = await Promise.all([
        this.weddingService.getAllWeddings(),
        this.weddingService.getAllLocations(),
        this.weddingService.getAllServices()
      ]);
      this.weddings.data = weddings;
      this.locations = locations;
      this.services = services.filter(s => s.available);
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onImageSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput.files?.length) return;

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result as string;
    this.weddingForm.patchValue({ imageUrl });
  };

  reader.readAsDataURL(file);
}

  async saveWedding(): Promise<void> {
  if (this.weddingForm.invalid) {
    this.weddingForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const formValue = this.weddingForm.getRawValue();
  const weddingData: Omit<Wedding, 'id'> = {
    title: formValue.title,
    location: formValue.location,
    weddingDate: formValue.weddingDate,
    serviceLevel: formValue.serviceLevel,
    description: formValue.description,
    status: 'Elérhető',
    imageUrl: formValue.imageUrl,
    services: formValue.services
  };

  try {
    if (this.editingWeddingId) {
      // módosítás
      await this.weddingService.updateWedding(this.editingWeddingId, weddingData);
      const updatedList = await this.weddingService.getAllWeddings();
      this.weddings.data = updatedList;
    } else {
      // új hozzáadás
      const addedWedding = await this.weddingService.addWedding(weddingData);
      this.weddings.data = [...this.weddings.data, addedWedding];
    }

    this.weddingForm.reset({
      serviceLevel: ServiceLevel.Alap,
      weddingDate: new Date()
    });
    this.editingWeddingId = null;

  } catch (error) {
    console.error('Esküvő mentési hiba:', error);
  } finally {
    this.isLoading = false;
  }
}

  editWedding(wedding: Wedding): void {
  this.editingWeddingId = wedding.id;
  this.weddingForm.patchValue(wedding);
  }

  async addLocation(): Promise<void> {
  if (this.locationForm.invalid) {
    this.locationForm.markAllAsTouched();
    return;
  }

  const data = this.locationForm.getRawValue();

  try {
    if (this.editingLocationId) {
      await this.weddingService.updateLocation(this.editingLocationId, data);
      this.editingLocationId = null;
    } else {
      await this.weddingService.addLocation(data);
    }

    this.locations = await this.weddingService.getAllLocations();
    this.locationForm.reset();

  } catch (error) {
    console.error('Helyszín mentési hiba:', error);
  }
}


  async deleteLocation(id: string): Promise<void> {
  try {
    await this.weddingService.deleteLocation(id);
    this.locations = await this.weddingService.getAllLocations();
  } catch (error) {
    console.error('Hiba a helyszín törlésekor:', error);
  }
}

editService(service: Service): void {
  this.editingServiceId = service.id;
  this.serviceForm.patchValue(service);
}

async deleteService(id: string): Promise<void> {
  try {
    await this.weddingService.deleteService(id);
    const all = await this.weddingService.getAllServices();
    this.services = all.filter(s => s.available);
  } catch (error) {
    console.error('Hiba a szolgáltatás törlésekor:', error);
  }
}  

  async resetWeddingStatus(wedding: Wedding): Promise<void> {
    const newDateStr = prompt("Adj meg új dátumot (éééé-hh-nn):", wedding.weddingDate.toISOString().substring(0, 10));
    if (!newDateStr) return;

    const parsedDate = new Date(newDateStr);
    if (isNaN(parsedDate.getTime())) {
      alert('Érvénytelen dátumformátum!');
      return;
    }

    wedding.weddingDate = parsedDate;
    try {
      await this.weddingService.updateWeddingStatus(wedding.id, 'Elérhető');
    } catch (error) {
      console.error('Státusz frissítés sikertelen:', error);
    }
  }

  async deleteWedding(id: string): Promise<void> {
    this.isLoading = true;
    try {
      await this.weddingService.deleteWedding(id);
      const updated = await this.weddingService.getAllWeddings();
      this.weddings.data = updated;
    } catch (error) {
      console.error('Hiba az esküvő törlésekor:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async addService(): Promise<void> {
  if (this.serviceForm.invalid) {
    this.serviceForm.markAllAsTouched();
    return;
  }

  const data = this.serviceForm.getRawValue();

  try {
    if (this.editingServiceId) {
      await this.weddingService.updateService(this.editingServiceId, data);
      this.editingServiceId = null;
    } else {
      await this.weddingService.addService(data);
    }

    const all = await this.weddingService.getAllServices();
    this.services = all.filter(s => s.available);
    this.serviceForm.reset({ available: true });

  } catch (error) {
    console.error('Szolgáltatás mentési hiba:', error);
  }
}

editLocation(location: WeddingLocation): void {
  this.editingLocationId = location.id;
  this.locationForm.patchValue(location);
}


  cancelEdit(): void {
  this.editingWeddingId = null;
  this.weddingForm.reset({
    serviceLevel: ServiceLevel.Alap,
    weddingDate: new Date()
  });
}
}
