import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName: string;
  public error: boolean;
  public isLoading: boolean;

  constructor(
    private router: Router,
    private loginService: LoginService) {
    this.reset();
  }

  /**
   * On component init
   */
  ngOnInit(): void {
    this.isLoggedInOnInit();
  }
    
  /**
   * Reset variables
   */
  private reset() {
    this.isLoading = false;
    this.userName = null;
    this.error = false;
  }

  /**
   * Login user with username
   */
  public loginUser() {
    if (!this.userName) { return null; }
    this.isLoading = true;

    // Send login request
    this.loginService.login(this.userName)
    .subscribe((result: User) => {
      this.isLoading = false;
      this.router.navigate(['/chat']);
    // If error occurs
    }, err => {
      this.isLoading = false;
      this.error = true;
      console.log(err);
    });
  }

  /**
   * Check if user already logged in
   */
  private isLoggedInOnInit() {
    this.isLoading = true;
    this.loginService.isUserLoggedIn()
    .subscribe((result: boolean) => {
      this.isLoading = false;
      // Redirect to chat if user already logged in
      if (result) {
        this.router.navigate(['/chat']);
      }
    });
  
  }

}
