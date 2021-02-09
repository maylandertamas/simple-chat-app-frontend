import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatComponent } from 'src/app/components/chat/chat.component';
import { LoginService } from 'src/app/services/login/login.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanDeactivate<ChatComponent> {

  constructor(
    private loginService: LoginService ) {}

  canDeactivate(
    component: ChatComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean> {
    return this.loginService.isUserLoggedIn()
      .pipe(map((res:boolean) => {
        return !res;
    }));
  }
  
}
