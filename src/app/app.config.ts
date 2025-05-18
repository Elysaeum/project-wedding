import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => 
      initializeApp({ projectId: "project-wedding-541c1", 
        appId: "1:217692521362:web:8fe66b51aed7e1514ab74b", 
        storageBucket: "project-wedding-541c1.firebasestorage.app", 
        apiKey: "AIzaSyDsL0CZdLyHoG2V6sjid-m58bCqXNJ1r70", 
        authDomain: "project-wedding-541c1.firebaseapp.com", 
        messagingSenderId: "217692521362" })), 
        provideAuth(() => 
          getAuth()), 
        provideFirestore(() => 
          getFirestore())]
};
