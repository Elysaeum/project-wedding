import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Wedding } from '../models/Wedding';
import { updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
  
  ) {
    this.authService.currentUser.subscribe(async authUser => {
      if (authUser) {
        const userData = await this.fetchUserDoc(authUser.uid);
        this.currentUserSubject.next(userData);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  getFullUserData(): Observable<{
    user: User | null,
    likedWeddings: Wedding[],
    reservedWeddings: Wedding[]
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            likedWeddings: [],
            reservedWeddings: []
          });
        }

        return from(this.fetchUserData(authUser.uid));
      })
    );
  }

  private async fetchUserData(userId: string): Promise<{
    user: User | null,
    likedWeddings: Wedding[],
    reservedWeddings: Wedding[]
  }> {
    try {
      // 1. Felhasználó dokumentum lekérése
      const userRef = doc(this.firestore, 'Users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return { user: null, likedWeddings: [], reservedWeddings: [] };
      }

      const userData = userSnap.data() as User;
      const user: User = { ...userData, id: userId };

      // 2. Esküvők lekérdezése ID alapján
      const likedWeddings = await this.getWeddingsByIds(user.liked_weddings);
      const reservedWeddings = await this.getWeddingsByIds(user.reserved_weddings);

      return {
        user,
        likedWeddings,
        reservedWeddings
      };

    } catch (error) {
      console.error('Hiba a felhasználó vagy esküvők lekérése során:', error);
      return { user: null, likedWeddings: [], reservedWeddings: [] };
    }
  }

  private async fetchUserDoc(userId: string): Promise<User | null> {
    const userRef = doc(this.firestore, 'Users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userId, ...userSnap.data() } as User;
    }
    return null;
  }

  private async getWeddingsByIds(ids: string[]): Promise<Wedding[]> {
    if (!ids || ids.length === 0) return [];

    const weddingsRef = collection(this.firestore, 'Weddings');
    const q = query(weddingsRef, where('__name__', 'in', ids));
    const snapshot = await getDocs(q);

    const weddings: Wedding[] = [];
    snapshot.forEach(doc => weddings.push({ ...doc.data(), id: doc.id } as Wedding));
    return weddings;
  }

  async reserveWeddingForUser(userId: string, weddingId: string): Promise<void> {
    const userRef = doc(this.firestore, 'Users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      const updatedList = Array.from(new Set([...(userData.reserved_weddings || []), weddingId]));
      await updateDoc(userRef, { reserved_weddings: updatedList });
    }
  }

   async likeWedding(wedding: Wedding): Promise<void> {
    const user = this.currentUserSubject.value;
    if (!user) throw new Error('Nincs bejelentkezett felhasználó');
    const likedWeddings = new Set(user.liked_weddings || []);
    likedWeddings.add(wedding.id);
    const userRef = doc(this.firestore, 'Users', user.id);
    await updateDoc(userRef, { liked_weddings: Array.from(likedWeddings) });
    user.liked_weddings = Array.from(likedWeddings);
    this.currentUserSubject.next(user);
  }

  async unlikeWedding(weddingId: string): Promise<void> {
    const user = this.currentUserSubject.value;
    if (!user) throw new Error('Nincs bejelentkezett felhasználó');
    const likedWeddings = new Set(user.liked_weddings || []);
    likedWeddings.delete(weddingId);
    const userRef = doc(this.firestore, 'Users', user.id);
    await updateDoc(userRef, { liked_weddings: Array.from(likedWeddings) });
    user.liked_weddings = Array.from(likedWeddings);
    this.currentUserSubject.next(user);
  }

}
