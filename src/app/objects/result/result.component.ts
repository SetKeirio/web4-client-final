import {Component, Input, OnInit} from '@angular/core';
import {Result} from "../../entities/result";

@Component({
  selector: 'one-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent{

  @Input() result: Result;

  constructor() { }

  ngOnInit(): void {
  }

}
