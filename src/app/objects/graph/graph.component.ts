import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'graph-page',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('graph1') paint: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.paint);
    var canvas = this.paint.nativeElement;
    var background = new Image();
    background.src = "assets/graph1.jpg";
    background.onload = function(){
      canvas.getContext("2d").drawImage(background, 0, 0);
    }
  }

}
