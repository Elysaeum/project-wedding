import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';
import { Wedding } from '../models/Wedding';
import { ServiceLevel } from '../models/ServiceLevel';
import { UserService } from './user.service';
import { Service } from '../models/Service';
import { AuthService } from './auth.service';
import { WeddingLocation } from '../models/WeddingLocation';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {
  private readonly WEDDING_COLLECTION = 'Weddings';
  private readonly LOCATION_COLLECTION = 'Locations';
  private readonly SERVICE_COLLECTION = 'Services';

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // 🔹 GET all weddings
  async getAllWeddings(): Promise<Wedding[]> {
    const ref = collection(this.firestore, this.WEDDING_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Wedding));
  }

  // 🔹 GET wedding by ID
  async getWeddingById(id: string): Promise<Wedding | null> {
    const weddingRef = doc(this.firestore, this.WEDDING_COLLECTION, id);
    const weddingSnap = await getDoc(weddingRef);
    return weddingSnap.exists() ? ({ ...weddingSnap.data(), id } as Wedding) : null;
  }

  // 🔹 ADD new wedding
  async addWedding(wedding: Omit<Wedding, 'id'>): Promise<Wedding> {
    const ref = collection(this.firestore, this.WEDDING_COLLECTION);
    const docRef = await addDoc(ref, wedding);
    return { ...wedding, id: docRef.id };
  }

  // 🔹 DELETE wedding
  async deleteWedding(id: string): Promise<void> {
    const ref = doc(this.firestore, this.WEDDING_COLLECTION, id);
    return deleteDoc(ref);
  }

  // 🔹 UPDATE wedding status
  async updateWeddingStatus(id: string, status: 'Elérhető' | 'Függő' | 'Foglalt'): Promise<void> {
    const ref = doc(this.firestore, this.WEDDING_COLLECTION, id);
    await updateDoc(ref, { status });
  }

  // 🔹 RESERVE wedding (with user update)
  async reserveWedding(id: string, serviceLevel: ServiceLevel): Promise<void> {
    const weddingRef = doc(this.firestore, this.WEDDING_COLLECTION, id);
    await updateDoc(weddingRef, {
      status: 'Foglalt',
      serviceLevel
    });

    const user = this.authService.getCurrentUserSync();
    if (user) {
      await this.userService.reserveWeddingForUser(user.uid, id);
    }
  }

  // 🔹 GET all locations
  async getAllLocations(): Promise<WeddingLocation[]> {
    const ref = collection(this.firestore, this.LOCATION_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as WeddingLocation));
  }

  // 🔹 GET all services
  async getAllServices(): Promise<Service[]> {
    const ref = collection(this.firestore, this.SERVICE_COLLECTION);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Service));
  }

  async addLocation(location: Omit<WeddingLocation, 'id'>): Promise<void> {
    const ref = collection(this.firestore, this.LOCATION_COLLECTION);
    await addDoc(ref, location);
  }

  async deleteLocation(id: string): Promise<void> {
    const ref = doc(this.firestore, this.LOCATION_COLLECTION, id);
    await deleteDoc(ref);
  }

  // 🔹 GET location by ID
  async getLocationById(id: string): Promise<WeddingLocation | null> {
    const ref = doc(this.firestore, this.LOCATION_COLLECTION, id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ ...snap.data(), id } as WeddingLocation) : null;
  }

  // 🔹 GET services by IDs
  async getServicesByIds(ids: string[]): Promise<Service[]> {
    if (!ids.length) return [];

    const ref = collection(this.firestore, this.SERVICE_COLLECTION);
    const q = query(ref, where('__name__', 'in', ids));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Service));
  }

  async addService(service: Omit<Service, 'id'>): Promise<void> {
    const ref = collection(this.firestore, this.SERVICE_COLLECTION);
    await addDoc(ref, service);
  }

  async deleteService(id: string): Promise<void> {
    const ref = doc(this.firestore, this.SERVICE_COLLECTION, id);
    await deleteDoc(ref);
  }

  async updateWedding(id: string, updatedData: Partial<Wedding>): Promise<void> {
  const ref = doc(this.firestore, this.WEDDING_COLLECTION, id);
  await updateDoc(ref, updatedData);
}

async updateLocation(id: string, updatedData: Partial<WeddingLocation>): Promise<void> {
  const ref = doc(this.firestore, this.LOCATION_COLLECTION, id);
  await updateDoc(ref, updatedData);
}

async updateService(id: string, updatedData: Partial<Service>): Promise<void> {
  const ref = doc(this.firestore, this.SERVICE_COLLECTION, id);
  await updateDoc(ref, updatedData);
}

  // 🔹 GET full wedding with related data
  async getWeddingWithDetails(id: string): Promise<{
    wedding: Wedding;
    location: WeddingLocation | null;
    services: Service[];
  } | null> {
    const wedding = await this.getWeddingById(id);
    if (!wedding) return null;

    const [location, services] = await Promise.all([
      this.getLocationById(wedding.location),
      this.getServicesByIds(wedding.services)
    ]);

    return { wedding, location, services };
  }
}
