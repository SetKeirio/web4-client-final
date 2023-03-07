import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResultsAlgorithms} from "../../algorithms/results.algorithms";
import {Result} from "../../entities/result";

@Component({
  selector: 'main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit{
  @ViewChild('graph1') paint: ElementRef;
  results: Result[] = [];
  nowRadius: number;

  constructor(private algorithm: ResultsAlgorithms) {
    this.dataForm = new FormGroup({
      validateX: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)]),
      validateY: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)]),
      validateR: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)])
    });
    this.algorithm.getAll().subscribe(results => {
      this.results = results;
    })
    this.nowRadius = 1;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.positiveRadius()
  }
  dataForm: FormGroup;

  clearCanvas(): void {
    this.paint.nativeElement.getContext('2d').clearRect(0, 0, 352, 352);
  }

  positiveRadius(): void{
    this.nowRadius = this.dataForm.controls.validateR.value;
    var p = this.paint.nativeElement;
    this.clearCanvas();
    var canvas = this.paint.nativeElement;
    var nowResults = this.results;
    var radius = this.nowRadius;
    var background = new Image();
    background.src = "assets/graph1.jpg";
    background.onload = function(){
      p.getContext('2d').clearRect(0, 0, 352, 352);
      console.log(radius);
      canvas.getContext("2d").drawImage(background, 0, 0);
      for (let i = 0; i < nowResults.length; i++){
        var pixelX: number = nowResults[i].x;
        var pixelY: number = nowResults[i].y;
        var y: number = nowResults[i].y;
        var x: number = nowResults[i].x;
        pixelX = 175 + (nowResults[i].x * 70 * 2 / radius);
        pixelY = 176 - (nowResults[i].y * 70 * 2 / radius);
        var inArea: boolean;
        if (radius < 0){
          inArea = (x <= 0 && y >= 0 && x >= radius/2 && y <= -radius) ||
          (x >= 0 && y <= 0 && y >= x + radius / 2) ||
          (x >= 0 && y >= 0 && Math.sqrt(y * y + x * x) <= (-radius / 2));
        }
        else{
          inArea = (x >= 0 && y <= 0 && x <= radius/2 && y >= -radius) ||
            (x <= 0 && y >= 0 && y <= x + radius / 2) ||
            (x <= 0 && y <= 0 && Math.sqrt(x * x + y * y) <= radius / 2)
        }
        let l = p.getContext('2d');
        l.setLineDash([1.5, 1.5]);
        l.beginPath();
        l.moveTo(pixelX, 175);
        l.lineTo(pixelX, pixelY);
        l.moveTo(176, pixelY);
        l.lineTo(pixelX, pixelY);
        l.stroke();
        if (!inArea) {
          l.fillStyle = "#ff0000";
        }
        else{
          l.fillStyle = "#00ff00";
        }
        l.arc(pixelX, pixelY, 2, 0, 2 * Math.PI);
        l.fill();
      }
    }

  }

  canvasAdd(event: MouseEvent): void {
    if (this.dataForm.controls.validateR.valid) {
      const yValue: number = (-event.offsetY + 176) / 70 / 2;
      const xValue: number = (event.offsetX - 175) / 70 / 2;
      let x = xValue * Math.abs(this.nowRadius);
      let y = yValue * Math.abs(this.nowRadius);
      let radius = this.nowRadius;
      let inArea: boolean;
      if (radius < 0){
        inArea = (x <= 0 && y >= 0 && x >= radius/2 && y <= -radius) ||
          (x >= 0 && y <= 0 && y >= x + radius / 2) ||
          (x >= 0 && y >= 0 && Math.sqrt(y * y + x * x) <= (-radius / 2));
      }
      else{
        inArea = (x >= 0 && y <= 0 && x <= radius/2 && y >= -radius) ||
          (x <= 0 && y >= 0 && y <= x + radius / 2) ||
          (x <= 0 && y <= 0 && Math.sqrt(x * x + y * y) <= radius / 2)
      }
      this.draw(xValue * 70 * 2 + 175, -(yValue * 70 * 2 - 176), inArea);
      this.addPointCanvas(x, y);

    }
  }

  addPointCanvas(xValue: number, yValue: number): void{
    const rValue = this.dataForm.controls.validateR.value;
    this.algorithm.addOne({x: xValue, y:yValue, r: rValue}, true).subscribe(res => {
        this.algorithm.getAll().subscribe(results1 => {
          this.results = results1;
        })
      }
    )
    console.log("add");
  }

  nullRadius(): void{
    this.nowRadius = this.dataForm.controls.validateR.value;
    this.clearCanvas();
    var canvas = this.paint.nativeElement;
    var background = new Image();
    background.src = "assets/graph3.jpg";
    background.onload = function(){
      canvas.getContext("2d").drawImage(background, 0, 0);
    }
  }

  negativeRadius(): void{
    this.nowRadius = this.dataForm.controls.validateR.value;
    var p = this.paint.nativeElement;
    var canvas = this.paint.nativeElement;
    var nowResults = this.results;
    var radius = this.nowRadius;
    var background = new Image();
    background.src = "assets/graph2.jpg";
    background.onload = function(){
      p.getContext('2d').clearRect(0, 0, 352, 352);
      console.log(radius);
      canvas.getContext("2d").drawImage(background, 0, 0);
      for (let i = 0; i < nowResults.length; i++){
        var pixelX: number = nowResults[i].x;
        var pixelY: number = nowResults[i].y;
        var y: number = nowResults[i].y;
        var x: number = nowResults[i].x;
        pixelX = 175 + (nowResults[i].x * 70 * 2 / -radius);
        pixelY = 176 - (nowResults[i].y * 70 * 2 / -radius);
        var inArea: boolean;
        if (radius < 0){
          inArea = (x <= 0 && y >= 0 && x >= radius/2 && y <= -radius) ||
            (x >= 0 && y <= 0 && y >= x + radius / 2) ||
            (x >= 0 && y >= 0 && Math.sqrt(y * y + x * x) <= (-radius / 2));
        }
        else{
          inArea = (x >= 0 && y <= 0 && x <= radius/2 && y >= -radius) ||
            (x <= 0 && y >= 0 && y <= x + radius / 2) ||
            (x <= 0 && y <= 0 && Math.sqrt(x * x + y * y) <= radius / 2)
        }
        let l = p.getContext('2d');
        l.setLineDash([1.5, 1.5]);
        l.beginPath();
        l.moveTo(pixelX, 175);
        l.lineTo(pixelX, pixelY);
        l.moveTo(176, pixelY);
        l.lineTo(pixelX, pixelY);
        l.stroke();
        if (!inArea) {
          l.fillStyle = "#ff0000";
        }
        else{
          l.fillStyle = "#00ff00";
        }
        l.arc(pixelX, pixelY, 2, 0, 2 * Math.PI);
        l.fill();
      }
    }
  }

  draw(x: number, y: number, inArea:boolean): void{
    var p = this.paint.nativeElement;
      let l = p.getContext('2d');
      l.setLineDash([1.5, 1.5]);
      l.beginPath();
      l.moveTo(x, 175);
      l.lineTo(x, y);
      l.moveTo(176, y);
      l.lineTo(x, y);
      l.stroke();
      if (!inArea) {
        l.fillStyle = "#ff0000";
      }
      else{l.fillStyle = "#00FF00";}

      l.arc(x, y, 2, 0, 2 * Math.PI);
      l.fill();

  }

  ngOnDestroy(): void {
  }

  yValidate(): void{
    this.dataForm.controls.validateY.setValue(this.dataForm.controls.validateY.value.replace(",", "."));
  }

  addPoint(): void{

    const xValue = this.dataForm.controls.validateX.value;
    const yValue = this.dataForm.controls.validateY.value;
    const rValue = this.dataForm.controls.validateR.value;
    this.algorithm.addOne({x: xValue, y:yValue, r: rValue}, false).subscribe(res => {
      this.algorithm.getAll().subscribe(results1 => {
        this.results = results1;
      })
      }
    )
    console.log("add");

  }

}
