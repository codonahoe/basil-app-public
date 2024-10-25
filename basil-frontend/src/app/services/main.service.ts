import { Injectable } from '@angular/core';
import { UserData } from '../interfaces/user-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {

  constructor(public http:HttpClient) { }

  getMeasurementData(){
    return this.http.get<Array<UserData>>('http://localhost:8080/api/data');
  }
}
