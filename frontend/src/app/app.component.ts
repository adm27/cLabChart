import {Component, OnInit} from '@angular/core';
import {ServerApiService} from "./serverApiService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  constructor(private serverApi: ServerApiService) {
  }

  ngOnInit(){
    this.serverApi.getVariables();
  }
}
