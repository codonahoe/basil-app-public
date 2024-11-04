import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { MainServiceService } from '../services/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public invalidCredentials = false;
  public loginSuccessful = false;
  public username:string | null = null;
  public password:string | null = null;

  constructor(private router:Router, public mainService:MainServiceService){}

  login(){
    this.invalidCredentials = false;
    this.loginSuccessful = false;
    console.log(this.username)
    console.log(this.password)
    if(this.username == null || this.password == null) return;
    const username = this.username;
    
    const password = CryptoJS.SHA256(this.password).toString();
    this.mainService.validateLogin(username, password)
      .pipe()
      .subscribe((res) => {
        if(res == 200){
          this.loginSuccessful = true;
          setTimeout(() => {
            this.loginSuccessful = false;
            this.router.navigate(['/main']); 
          }, 2000);  
        }
        else{
          this.invalidCredentials = true;
        }
      })

  }



}
