import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResetService } from '../reset/reset.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedInUser: User; 
  private isLoggedIn: boolean;

  constructor(private resetService: ResetService,
              private http: HttpClient) {
    this.reset();
  }

  /**
   * Reset variables
   * */
  private reset() : void {
    this.loggedInUser = null;
    this.isLoggedIn = false;
  }

  /**
   * Check if user is already logged in
   */
  public isUserLoggedIn() : Observable<boolean> {
    return new Observable<boolean>(observer => {
      observer.next(this.isLoggedIn);
    }).pipe(first());
  }

  /**
   * Login user with username
   * @param username
   */
  public login(username: string) : Observable<User> {
    if (!username) { return null; }
    // If username is the same as in cache, return cache
    if (this.loggedInUser && this.loggedInUser.username === username) {
      return new Observable(observer => {
        this.isLoggedIn = true;
        observer.next(this.loggedInUser)
      }).pipe(first());
    }
    // Request login from backend
    return this.http.post('api/users', { username: username })
    .pipe(
      map((user: User) => {
          if (user) {
            this.isLoggedIn = true;
            this.loggedInUser = user;
          }
          return user;
    }), first());
  }

  /**
   * Get logged in user instance
   */
  public getLoggedInUser() : Observable<User> {
    return new Observable(observer => {
      if (!this.loggedInUser) {
        observer.error("Logged in user not found");
      }
      observer.next(this.loggedInUser);
    }).pipe(first());
  }

  /**
   * Logout current user
   */
  public logout() {
    // Trigger reset event to clear out caches of subscribers
    this.resetService.triggerResetEvent();
    this.reset();
  }
}
