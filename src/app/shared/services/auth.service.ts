import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getInitialLoginStatus());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  public currentUser: Observable<FirebaseUser | null>;
  private lastUser: FirebaseUser | null = null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.currentUser = authState(this.auth);

    this.currentUser.subscribe(user => {
      const loggedIn = !!user;
      this.lastUser = user;
      localStorage.setItem('isLoggedIn', loggedIn.toString());
      localStorage.setItem('userName', user?.email ?? 'Vendég');
      this.isLoggedInSubject.next(loggedIn);
    });
  }

  private getInitialLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userName');
    this.isLoggedInSubject.next(false);

    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }

  async signUp(email: string, password: string, userData: Partial<User>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      await this.createUserData(userCredential.user.uid, {
        ...userData,
        id: userCredential.user.uid,
        email,
        liked_weddings: [],
        reserved_weddings: [],
      });

      return userCredential;
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }

  private async createUserData(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(collection(this.firestore, 'Users'), userId);
    return setDoc(userRef, userData);
  }

  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }

  getCurrentUserSync(): FirebaseUser | null {
  return this.lastUser;
}

  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
    this.isLoggedInSubject.next(isLoggedIn);
  }
}
