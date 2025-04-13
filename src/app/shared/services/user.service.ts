import { Injectable } from '@angular/core';
import { User, Role } from '../models/User';
import { Wedding } from '../models/Wedding';
import { ServiceLevel } from '../models/ServiceLevel'; // Importáld az Enumot
import { Location } from '../models/Location'; // Importáld a Location interfészt

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageKey = 'currentUser';

  private currentUser: User;

  constructor() {
    const storedUser = localStorage.getItem(this.storageKey);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    } else {
      this.currentUser = {
        name: { firstname: 'Anna', lastname: 'Kovács' },
        email: 'test@gmail.com',
        password: 'testpw',
        liked_weddings: this.getDefaultLikedWeddings(),
        reserved_weddings: this.getDefaultReservedWeddings(),
        role: Role.User
      };
    }
  }

  private getDefaultLikedWeddings(): Wedding[] {
    return [
      {
        id: 1,
        title: 'Kertes esküvő',
        location: {
          name: 'Budapest',
          city: 'Budapest',
          country: 'Magyarország',
          capacity: 100,
          description: 'A szép kerthelyszín egy különleges esküvőhöz'
        },
        weddingDate: new Date('2024-06-15'),
        serviceLevel: ServiceLevel.Prémium, // Enum érték használata
        description: 'A beautiful wedding with a great view!',
        status: 'Elérhető',
        services: []
      },
      {
        id: 2,
        title: 'Kastély esküvő',
        location: {
          name: 'Debreceni Kastély',
          city: 'Debrecen',
          country: 'Magyarország',
          capacity: 150,
          description: 'Elegáns kastély, ami tökéletes helyszíne egy esküvőnek.'
        },
        weddingDate: new Date('2024-07-20'),
        serviceLevel: ServiceLevel.Alap, // Enum érték használata
        description: 'A simple but elegant wedding.',
        status: 'Függő',
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
      }
    ];
  }

  private getDefaultReservedWeddings(): Wedding[] {
    return [
      {
        id: 3,
        title: 'Romantikus esküvő homokos tengerparton',
        location: {
          name: 'Szeged Tengerpart',
          city: 'Szeged',
          country: 'Magyarország',
          capacity: 200,
          description: 'Luxus esküvő a homokos tengerparton.'
        },
        weddingDate: new Date('2024-08-01'),
        serviceLevel: ServiceLevel.Luxus,
        description: 'A luxurious wedding with grand arrangements.',
        status: 'Foglalt',
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
      }
    ];
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  likeWedding(wedding: Wedding): void {
    const alreadyLiked = this.currentUser.liked_weddings.some(w => w.id === wedding.id);
    if (!alreadyLiked) {
      this.currentUser.liked_weddings.push(wedding);
      this.setCurrentUser(this.currentUser);
    }
  }

  unlikeWedding(weddingId: number): void {
    this.currentUser.liked_weddings = this.currentUser.liked_weddings.filter(w => w.id !== weddingId);
    this.setCurrentUser(this.currentUser);
  }

  reserveWedding(wedding: Wedding): void {
    const index = this.currentUser.reserved_weddings.findIndex(w => w.id === wedding.id);
    if (index !== -1) {
      this.currentUser.reserved_weddings[index] = wedding;
    } else {
      this.currentUser.reserved_weddings.push(wedding);
    }
    this.setCurrentUser(this.currentUser);
  }

  updateReservedWedding(weddingId: number, serviceLevel: ServiceLevel): void {
    const reservedWedding = this.currentUser.reserved_weddings.find(w => w.id === weddingId);
    if (reservedWedding) {
      reservedWedding.serviceLevel = serviceLevel; // Enum típus
      this.setCurrentUser(this.currentUser);
    }
  }
}
