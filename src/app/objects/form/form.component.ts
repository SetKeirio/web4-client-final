import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Result} from '../../entities/result';
import {Request} from '../../entities/request';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ResultsAlgorithms} from "../../algorithms/results.algorithms";

@Component({
  selector: 'form-page',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {
  //@Input() results: Result[];
  //private change: Subscription;
  //@Output() pointsUpdated = new EventEmitter<any>();
  dataForm: FormGroup;
  constructor(private algorithm: ResultsAlgorithms) {
    this.dataForm = new FormGroup({
      validateX: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)]),
      validateY: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)]),
      validateR: new FormControl(null, [Validators.required, Validators.pattern(/^[-]?(((0{1}|[1-4]){1}(\.[0-9]+)?)|5(\.0+)?)$/)])
    });
  }

  ngOnInit(): void {
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
    this.algorithm.addOne({x: xValue, y:yValue, r: rValue}, false).subscribe(results => {
    })
    console.log("add");

  }

}
