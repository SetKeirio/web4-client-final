import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResultsAlgorithms} from "../../algorithms/results.algorithms";
import {Result} from "../../entities/result";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ExceptionMessageRequest} from "../../entities/expection.message.request";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {LoginComponent} from "../login/login.component";
import {LoginAlgorithm} from "../../algorithms/login.algorithm";

@Component({
  selector: 'main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit{
  @ViewChild('graph1') paint: ElementRef;
  results: Result[] = [];
  nowRadius: number;
  authToken: string | null;
  message: ExceptionMessageRequest;

  constructor(private algorithm: ResultsAlgorithms, private http: HttpClient, private router: Router,
              private loginAlgorithm: LoginAlgorithm) {
    this.dataForm = new FormGroup({
      validateX: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)]),
      validateY: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)]),
      validateR: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)])
    });
    this.algorithm.getAll().subscribe(results => {
      this.results = results;
      this.positiveRadius(1);
    })
    this.nowRadius = 1;
  }

  ngOnInit(): void {
    //this.authToken = this.message.token;
    this.authToken = this.loginAlgorithm.getData('auth-token');
    console.log("с" + this.authToken);
    if (this.authToken != undefined && this.authToken != null && this.authToken != "undefined" && this.authToken != "null" && this.authToken.length > 0) {
      console.log('http://localhost:8080/lab4_335099_backend/rest/login?token=' + this.authToken);
      this.http.get<{token: ExceptionMessageRequest}>('http://localhost:8080/lab4_335099_backend/rest/login?token=' + this.authToken).pipe(
        tap(
          ({token}) => {
            this.message = token;
            if (this.message.message != "ok"){
              this.router.navigate(['/empty'])
            }
          }
        )
      );

    }
    else{
      console.log('http://localhost:8080/end/rest/login?token=' + this.authToken);
      this.router.navigate(['/empty']);
    }
  }

  ngAfterViewInit(): void {
    this.positiveRadius(1);
  }
  dataForm: FormGroup;

  clearCanvas(): void {
    this.paint.nativeElement.getContext('2d').clearRect(0, 0, 352, 352);
  }

  positiveRadius(button: number): void{
    this.nowRadius = this.dataForm.controls.validateR.value;
    var p = this.paint.nativeElement;
    this.clearCanvas();
    var canvas = this.paint.nativeElement;
    var nowResults = this.results;
    var radius = button;
    var background = new Image();
    background.src = "assets/graph1.jpg";
    background.onload = function(){
      p.getContext('2d').clearRect(0, 0, 352, 352);
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
      this.nowRadius = this.dataForm.controls.validateR.value;
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
      else if (radius > 0){
        inArea = (x >= 0 && y <= 0 && x <= radius/2 && y >= -radius) ||
          (x <= 0 && y >= 0 && y <= x + radius / 2) ||
          (x <= 0 && y <= 0 && Math.sqrt(x * x + y * y) <= radius / 2)
      }
      else{
        inArea = false;
      }
      this.draw(xValue * 70 * 2 + 175, -(yValue * 70 * 2 - 176), inArea);
      this.addPointCanvas(x, y);

    }
  }

  addPointCanvas(xValue: number, yValue: number): void{
    this.checkAutentify()
    const rValue = this.dataForm.controls.validateR.value;
    this.algorithm.addOne({x: xValue, y:yValue, r: rValue}, true).subscribe(res => {
        this.algorithm.getAll().subscribe(results1 => {
          this.results = results1;
        })
      }
    )

  }

  checkAutentify(){
    let nowAuth = this.loginAlgorithm.getData('auth-token');
    this.http.get<ExceptionMessageRequest>('http://localhost:8080/lab4_335099_backend/rest/login?token=' + nowAuth).subscribe(
        (token => {
          console.log("t " + token.message + " " + this.message);
          if (token.message != "ok"){
            this.router.navigate(['/empty'])
          }
        }
    ));
    console.log("i" + nowAuth);
    if (nowAuth != this.authToken){
      location.reload();
    }


  }

  nullRadius(): void{
    this.nowRadius = this.dataForm.controls.validateR.value;
    this.nowRadius = 0;
    this.clearCanvas();
    var canvas = this.paint.nativeElement;
    var background = new Image();
    background.src = "assets/graph3.jpg";
    background.onload = function(){
      canvas.getContext("2d").drawImage(background, 0, 0);
    }
  }

  negativeRadius(button: number): void{
    this.nowRadius = this.dataForm.controls.validateR.value;
    var p = this.paint.nativeElement;
    var canvas = this.paint.nativeElement;
    var nowResults = this.results;
    var radius = button;
    var background = new Image();
    background.src = "assets/graph2.jpg";
    background.onload = function(){
      p.getContext('2d').clearRect(0, 0, 352, 352);
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

  logout(): void{
    this.loginAlgorithm.logaout();
    this.router.navigate(['/empty']);

  }

  addPoint(): void{
    this.checkAutentify()
    const xValue = this.dataForm.controls.validateX.value;
    const yValue = this.dataForm.controls.validateY.value;
    const rValue = this.dataForm.controls.validateR.value;
    this.algorithm.addOne({x: xValue, y:yValue, r: rValue}, false).subscribe(res => {
      this.algorithm.getAll().subscribe(results1 => {
        this.results = results1;
        if (rValue > 0){
          this.positiveRadius(rValue);
        }
        else if (rValue < 0){
          this.negativeRadius(rValue);
        }
        else{
          this.nullRadius();
        }

      })
      }
    )

  }

}
