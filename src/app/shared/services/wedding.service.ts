import { Injectable } from '@angular/core';
import { Wedding } from '../models/Wedding';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { ServiceLevel } from '../models/ServiceLevel';
import { Location } from '../models/Location';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  private weddings: Wedding[] = [
    {
      id: 1,
      title: 'Romantikus esküvő homokos tengerparton',
      location: {
        name: 'Maldív-szigetek',
        city: 'Maldív-szigetek',
        country: 'Maldív-szigetek',
        capacity: 100,
        description: 'Romantikus tengerparti esküvői helyszín'
      },
      weddingDate: new Date('2025-03-25'),
      serviceLevel: ServiceLevel.Prémium,
      description: 'Egy szép helyen, Maldív-szigeteken lévő esküvő.',
      status: 'Elérhető',
      imageUrl: 'assets/images/maldives.jpg',
      services: [
        {
          id: 1,
          name: 'Dekoráció',
          description: 'Romantikus dekoráció a tengerparton.',
          price: 500,
          available: true
        },
        {
          id: 2,
          name: 'Fotószolgáltatás',
          description: 'Professzionális fotós az esküvőre.',
          price: 1000,
          available: true
        }
      ]
    },
    {
      id: 2,
      title: 'Kastély esküvő',
      location: {
        name: 'Château de Loire',
        city: 'Loire-völgye',
        country: 'Franciaország',
        capacity: 150,
        description: 'Egy középkori inspirált esküvő, Franciaország egyik kastélyában.'
      },
      weddingDate: new Date('2025-02-25'),
      serviceLevel: ServiceLevel.Luxus,
      description: 'Egy középkori inspirált esküvő, Franciaország egyik kastélyában.',
      status: 'Függő',
      imageUrl: 'assets/images/loire.jpg',
      services: [
        {
          id: 3,
          name: 'Zenekar',
          description: 'Élő zene a kastély kertjében.',
          price: 2000,
          available: true
        },
        {
          id: 4,
          name: 'Étkezés',
          description: 'Hagyományos francia étkezés a vendégeknek.',
          price: 1500,
          available: true
        }
      ]
    },
    {
      id: 3,
      title: 'Kertes esküvő',
      location: {
        name: 'Toszkánai Villa',
        city: 'Tuszkána',
        country: 'Olaszország',
        capacity: 80,
        description: 'Elbűvölő kerti esküvő, Toszkána egyik villájában.'
      },
      weddingDate: new Date('2025-01-25'),
      serviceLevel: ServiceLevel.Alap,
      description: 'Elbűvölő kerti esküvő, Toszkána egyik villájában.',
      status: 'Elérhető',
      imageUrl: 'assets/images/toszkana.jpg',
      services: [
        {
          id: 5,
          name: 'Kertészeti szolgáltatás',
          description: 'Különleges virágok és növények a kertben.',
          price: 300,
          available: true
        }
      ]
    }
  ];

  private weddingsSubject = new BehaviorSubject<Wedding[]>(this.weddings);

  constructor(private userService: UserService) {}

  getAllWeddings(): Observable<Wedding[]> {
    return this.weddingsSubject.asObservable();
  }

  addWedding(wedding: Omit<Wedding, 'id'>): Promise<Wedding> {
    return new Promise((resolve) => {
      const newId = this.weddings.length > 0
        ? Math.max(...this.weddings.map(w => w.id)) + 1
        : 1;

      const newWedding: Wedding = {
        ...wedding,
        id: newId
      };

      this.weddings.push(newWedding);
      this.weddingsSubject.next([...this.weddings]);

      setTimeout(() => {
        resolve(newWedding);
      }, 1000);
    });
  }

  getWeddingById(id: number): Observable<Wedding | null> {
    const wedding = this.weddings.find(wedding => wedding.id === id);
    return new Observable(observer => {
      observer.next(wedding ?? null);
      observer.complete();
    });
  }

  deleteWedding(id: number): void {
    this.weddings = this.weddings.filter(wedding => wedding.id !== id);
    this.weddingsSubject.next([...this.weddings]);
  }

  updateWeddingStatus(id: number, status: 'Elérhető' | 'Függő' | 'Foglalt'): void {
    const wedding = this.weddings.find(w => w.id === id);
    if (wedding) {
      wedding.status = status;
      this.weddingsSubject.next([...this.weddings]);

      if (status === 'Függő') {
        const user = this.userService.getCurrentUser();
        const alreadyReserved = user.reserved_weddings.some(w => w.id === wedding.id);
        if (!alreadyReserved) {
          user.reserved_weddings.push(wedding);
          this.userService.setCurrentUser(user);
        }
      }
    }
  }

  reserveWedding(weddingId: number, serviceLevel: ServiceLevel): void {
    const wedding = this.weddings.find(w => w.id === weddingId);
    if (wedding) {
      wedding.status = 'Foglalt';
      wedding.serviceLevel = serviceLevel;
      this.weddingsSubject.next([...this.weddings]);

      const updatedWedding: Wedding = {
        ...wedding,
        status: 'Foglalt',
        serviceLevel
      };

      this.userService.reserveWedding(updatedWedding);
    }
  }
}
