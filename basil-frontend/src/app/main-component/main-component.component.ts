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
        this.userData.temperature = this.roundMeasurementsToNearestHundreths(this.userData);
      });
  }

  getMeasurementData(){
    return this.http.get<Array<UserData>>('https://goldfish-app-ueyn8.ondigitalocean.app/api/data');
  }

  roundMeasurementsToNearestHundreths(userData:UserData){
    return Math.round(userData.temperature * 10) / 10;
  }
}
