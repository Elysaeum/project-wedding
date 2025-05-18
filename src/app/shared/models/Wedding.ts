import { Service } from "./Service";
import { ServiceLevel } from './ServiceLevel';
import { WeddingLocation } from './WeddingLocation'; // Importáljuk a Location interfészt

export interface Wedding {
  id: string;
  title: string;
  location: string; // Most már egy Location típusú objektum
  weddingDate: Date;
  serviceLevel: string; // Az esküvő szolgáltatási szintje
  description: string;
  status: 'Elérhető' | 'Függő' | 'Foglalt';
  imageUrl?: string;
  services: string[]; // Az esküvőhöz kapcsolódó szolgáltatások
}
