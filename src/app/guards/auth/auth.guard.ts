import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private loginService: LoginService) { }
  
  /**
   * Check if user is logged in
   * @param route 
   * @param state 
   */
  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      // Request user login status
      return this.loginService.isUserLoggedIn()
      .pipe(map((result: boolean) => {
        // Redirect to login if not logged in
        if (!result) {
          this.router.navigate(['/login']);
        }
        return result;
      }));
  }
  
}
