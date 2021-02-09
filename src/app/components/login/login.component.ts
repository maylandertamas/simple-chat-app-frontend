import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../interfaces/user';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName = new FormControl('', [Validators.required, Validators.maxLength(32)]);
  public isError: boolean;
  public error: any;
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
  }
    
  /**
   * Reset variables
   */
  private reset() {
    this.isLoading = false;
    this.error = false;
  }

  /**
   * Login user with username
   */
  public loginUser() {
    if (!this.userName.value || this.userName.errors) { return null; }
    this.isLoading = true;
    // Set timeout only for displaying loading screen
    // TODO: REMOVE
    setTimeout(() => { 
      // Send login request
      this.loginService.login(this.userName.value)
      .subscribe((result: User) => {
        this.isLoading = false;
        this.router.navigate(['/chat']);
      // If error occurs
      }, err => {
        this.isLoading = false;
        this.isError = true;
        this.error = err;
        console.log(err);
      });
    }, 1500);
  }

  /**
   * Get error message if invalid username
   *  */ 
  public getErrorMessage() {
    if (this.userName.errors.required) {
      return 'Username is missing';
    } else if(this.userName.errors.maxlength) {
      return 'Username is too long';
    } 
    return 'Invalid username';
  }
}
