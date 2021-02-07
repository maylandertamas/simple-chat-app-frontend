import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName: string;

  constructor(private loginService: LoginService) {
    this.reset();
  }

  ngOnInit(): void {
  }

  private reset() {
    this.userName = null;
  }

  public loginUser() {
    if (!this.userName) { return null; }
    this.loginService.login(this.userName).subscribe((res: User) => {
      console.log(res);
    });
  }

}
