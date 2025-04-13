import { Wedding } from "../shared/models/Wedding";
import { User, Role } from "../shared/models/User";
import { ServiceLevel } from "./models/ServiceLevel";

export const weddings: Wedding[] = [
  {
    id: 1,
    title: 'Romantikus esküvő homokos tengerparton',
    location: {
      name: 'Maldív-szigetek',
      city: 'Maldív-szigetek',
      country: 'Indiai-óceán',
      capacity: 200,
      description: 'Romantikus tengerparti esküvő.'
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
      name: 'Loire-völgye',
      city: 'Loire-völgye',
      country: 'Franciaország',
      capacity: 100,
      description: 'Középkori kastély, különleges esküvői helyszín.'
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
      name: 'Toszkána, Olaszország',
      city: 'Toszkána',
      country: 'Olaszország',
      capacity: 120,
      description: 'Kerthelyszíni esküvő egy olasz villában.'
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
export const UserObject: User[] = [
  {
    name: {
      firstname: "John",
      lastname: "Doe",
    },
    email: "john.doe@example.com",
    password: "password123",
    liked_weddings: [weddings[0], weddings[3]],
    reserved_weddings: [weddings[1]],
    role: Role.Admin, 
  },
  {
    name: {
      firstname: "Jane",
      lastname: "Smith",
    },
    email: "jane.smith@example.com",
    password: "pass456word",
    liked_weddings: [weddings[2]],
    reserved_weddings: [],
    role: Role.User,
  },
  {
    name: {
      firstname: "Robert",
      lastname: "Johnson",
    },
    email: "robert.j@example.com",
    password: "securePass789",
    liked_weddings: [],
    reserved_weddings: [weddings[2], weddings[3]],
    role: Role.Admin,
  },
  {
    name: {
      firstname: "Sarah",
      lastname: "Wilson",
    },
    email: "s.wilson@example.com",
    password: "wilsonPass2024",
    liked_weddings: [weddings[1]],
    reserved_weddings: [],
    role: Role.User,
  },
  {
    name: {
      firstname: "Michael",
      lastname: "Brown",
    },
    email: "m.brown@example.com",
    password: "mikeBrown321",
    liked_weddings: [weddings[0], weddings[1], weddings[2]],
    reserved_weddings: [weddings[0]],
    role: Role.Admin,
  },
];
