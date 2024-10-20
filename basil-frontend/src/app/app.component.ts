import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'basil-frontend';

  constructor(private http:HttpClient){

  }

  ngOnInit(): void {
      this.testConnectionToBackEnd();
  }

  testConnectionToBackEnd(){
    this.http.get<any>('http://localhost:8080/api/data').subscribe((res) => console.log(res))
  }


}
