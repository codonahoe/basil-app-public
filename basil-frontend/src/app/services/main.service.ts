import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'bootstrap';
import { ChangeableData } from '../interfaces/changeable-data';
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

  validateLogin(username:string, password:string){
    console.log(username)
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.get<number>('http://localhost:8080/api/login', { params });
  }

  updateLightArray(lightArrayValue:boolean){
    return this.http.post<number>('http://localhost:8080/api/send-to-esp32-light-array', { lightArrayValue });
  }

  updateWaterPump(waterPumpValue:boolean){
    return this.http.post<number>('http://localhost:8080/api/send-to-esp32-water-pump', { waterPumpValue });
  }

  getChangeableValues(){
    return this.http.get<Array<ChangeableData>>('https://goldfish-app-ueyn8.ondigitalocean.app/api/changable-data')
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
