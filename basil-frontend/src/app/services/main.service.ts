import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user-data';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Array<UserData>>('http://localhost:8080/api/data');
  }

  generateAiResponse(){
    return this.http.get<string>('http://localhost:8080/api/ai-feedback');
  }

  setUpModal(){
    const modal = document.getElementById('aiModal');
    const newModal = {
      id:'aiModal',
      modal: new bootstrap.Modal(modal),
    }

    this.modals.push(newModal);
    console.log(this.modals)
  }

  openModal(){
    this.modals[0].modal.show();
  }
}
