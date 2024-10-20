import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserData } from '../interfaces/user-data';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit{

  public userData:UserData | null = null;
  public title = 'basil-frontend';
  
  constructor(private http:HttpClient){

  }

  ngOnInit(): void {
      this.getMeasurementData()
      .pipe()
      .subscribe((data) => {
        [this.userData] = data;
        this.userData = this.roundMeasurementsToNearestHundreths(this.userData);
      });
  }

  getMeasurementData(){
    return this.http.get<Array<UserData>>('https://goldfish-app-ueyn8.ondigitalocean.app/api/data');
  }

  roundMeasurementsToNearestHundreths(userData:UserData){
    return {
      id: userData.id,
      temperature: Math.round(userData.temperature * 10) / 10,
      humidity: Math.round(userData.humidity * 10) / 10,
      ph: Math.round(userData.ph * 10) / 10,
      color: Math.round(userData.color * 10) / 10,
      light: Math.round(userData.light * 10) / 10,
      waterLevel: Math.round(userData.waterLevel * 10) / 10,
    } as UserData
  }
}
