import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hat-page',
  templateUrl: './hat.component.html',
  styleUrls: ['./hat.component.css']
})
export class HatComponent implements OnInit {
  image = "http://localhost:8080/web-lab3/resources/Antihype.jpeg";

  constructor() { }

  ngOnInit(): void {
  }

}
