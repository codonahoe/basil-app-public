import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserData } from '../interfaces/user-data';
import { MainServiceService } from '../services/main.service';
import { format, parse, parseISO } from 'date-fns';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnInit{

  public userData:Array<UserData> = [];
  public title = 'basil-frontend';
  public lightArrayValue:boolean = false;
  public waterPumpValue:boolean = false;
  
  constructor(
    public mainService:MainServiceService          
  ){

    this.mainService.getChangeableValues()
      .pipe()
      .subscribe((val) => {
        console.log(val);
        this.waterPumpValue = val[0].WaterPump;
        this.lightArrayValue = val[0].LightArray;
        console.log(this.lightArrayValue)
      })
  }

  ngOnInit(): void {
      this.mainService.getMeasurementData()
      .pipe()
      .subscribe((data) => {
        this.userData = data;
        this.userData = this.roundMeasurementsToNearestHundreths(this.userData);
      });
  }

  roundMeasurementsToNearestHundreths(userData:Array<UserData>){
    this.mainService.userData = userData;
    return userData.map((ud) => { return {
      id: ud.id,
      temperature: Math.round(ud.temperature * 10) / 10,
      humidity: Math.round(ud.humidity * 10) / 10,
      ph: Math.round(ud.ph * 10) / 10,
      color: ud.color,
      light: Math.round(ud.light * 10) / 10,
      waterLevel: ud.waterLevel,
      addedUTCDateTime: format(parseISO(ud.addedUTCDateTime.split('T')[0]), 'MM-dd-yyyy')
    } as UserData
    });
  }

  updateLightArray(){
    const lightArrayValue = !this.lightArrayValue;
    this.mainService.updateLightArray(lightArrayValue)
    .pipe()
    .subscribe((val) => {
      this.lightArrayValue = lightArrayValue;
    });
  }

  updateWaterPump(){
    console.log(this.waterPumpValue)
    const waterPumpValue = !this.waterPumpValue;
    this.mainService.updateWaterPump(waterPumpValue)
    .pipe()
    .subscribe((val) => {
      this.waterPumpValue = waterPumpValue;
    });
  }

}
