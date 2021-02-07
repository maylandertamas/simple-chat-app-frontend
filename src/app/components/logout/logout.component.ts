import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService) { }

  /**
  * On component init
  */
  ngOnInit(): void {

  }

  /**
   * On logout, reset everything and redirect to login page
   */
  public logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
