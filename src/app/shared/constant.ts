import { Wedding } from "../shared/models/Wedding";
import { User, Role } from "../shared/models/User";
import { ServiceLevel } from "./models/ServiceLevel";

export const weddings: Wedding[] = [
  {
    id: 'w1',
    title: 'Romantikus esküvő homokos tengerparton',
    location: 'loc1',
    weddingDate: new Date('2025-03-25'),
    serviceLevel: ServiceLevel.Prémium,
    description: 'Egy szép helyen, Maldív-szigeteken lévő esküvő.',
    status: 'Elérhető',
    imageUrl: 'assets/images/maldives.jpg',
    services: ['svc1', 'svc2']
  },
  {
    id: 'w2',
    title: 'Kastély esküvő',
    location: 'loc2',
    weddingDate: new Date('2025-02-25'),
    serviceLevel: ServiceLevel.Luxus,
    description: 'Egy középkori inspirált esküvő, Franciaország egyik kastélyában.',
    status: 'Függő',
    imageUrl: 'assets/images/loire.jpg',
    services: ['svc3', 'svc4']
  },
  {
    id: 'w3',
    title: 'Kertes esküvő',
    location: 'loc3',
    weddingDate: new Date('2025-01-25'),
    serviceLevel: ServiceLevel.Alap,
    description: 'Elbűvölő kerti esküvő, Toszkána egyik villájában.',
    status: 'Elérhető',
    imageUrl: 'assets/images/toszkana.jpg',
    services: ['svc5']
  }
];

export const UserObject: User[] = [
  {
    id: 'u1',
    name: {
      firstname: "John",
      lastname: "Doe",
    },
    email: "john.doe@example.com",
    liked_weddings: ['w1'],
    reserved_weddings: ['w2'],
    role: Role.Admin
  },
  {
    id: 'u2',
    name: {
      firstname: "Jane",
      lastname: "Smith",
    },
    email: "jane.smith@example.com",
    liked_weddings: ['w3'],
    reserved_weddings: [],
    role: Role.User
  },
  {
    id: 'u3',
    name: {
      firstname: "Robert",
      lastname: "Johnson",
    },
    email: "robert.j@example.com",
    liked_weddings: [],
    reserved_weddings: ['w3'],
    role: Role.Admin
  },
  {
    id: 'u4',
    name: {
      firstname: "Sarah",
      lastname: "Wilson",
    },
    email: "s.wilson@example.com",
    liked_weddings: ['w2'],
    reserved_weddings: [],
    role: Role.User
  },
  {
    id: 'u5',
    name: {
      firstname: "Michael",
      lastname: "Brown",
    },
    email: "m.brown@example.com",
    liked_weddings: ['w1', 'w2', 'w3'],
    reserved_weddings: ['w1'],
    role: Role.Admin
  }
];
