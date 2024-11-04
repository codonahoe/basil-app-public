import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'bootstrap';
declare var bootstrap: any; // Declare bootstrap to avoid TypeScript errors
@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  public modals:Array<any> = [];
  public userData:Array<UserData> = [];

  constructor(public http:HttpClient) { }

 getMeasurementData(){
    return this.http.get<Array<UserData>>('https://goldfish-app-ueyn8.ondigitalocean.app/api/data');
  }

  generateAiResponse(){
    return this.http.get<string>('https://goldfish-app-ueyn8.ondigitalocean.app/api/ai-feedback');
  }

  validateLogin(username:string, password:string){
    console.log(username)
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.get<number>('https://goldfish-app-ueyn8.ondigitalocean.app/api/login', { params });
  }

  setUpModal(){
    const modal = document.getElementById('aiModal');
    const newModal = {
      id:'aiModal',
      modal: new bootstrap.Modal(modal),
    }

    this.modals.push(newModal);
  }

  openModal(){
    this.modals[0].modal.show();
  }
}
