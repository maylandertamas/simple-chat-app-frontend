import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedInUser: User; 

  constructor(private http: HttpClient) {
    this.reset();
  }

  /**
   * Reset variables
   * */
  private reset() : void {
    this.loggedInUser = null;
  }

  /**
   * Login user with username
   * @param username
   */
  public login(username: string) {
    // Early out: If invalid input
    if (!username) { return null; }

    if (this.loggedInUser && this.loggedInUser.username === username) {
      return new Observable(observer => {
        observer.next(this.loggedInUser)
      }).pipe(first());
    }
    return this.http.post('api/users', { username: username }).pipe(first());
  }
}
