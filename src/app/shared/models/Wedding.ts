import { Service } from "./Service";
import { ServiceLevel } from './ServiceLevel';
import { Location } from './Location'; // Importáljuk a Location interfészt

export interface Wedding {
  id: number;
  title: string;
  location: Location; // Most már egy Location típusú objektum
  weddingDate: Date;
  serviceLevel: ServiceLevel; // Az esküvő szolgáltatási szintje
  description: string;
  status: 'Elérhető' | 'Függő' | 'Foglalt';
  imageUrl?: string;
  services: Service[]; // Az esküvőhöz kapcsolódó szolgáltatások
}
