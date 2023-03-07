import {Component, Input, OnInit} from '@angular/core';
import {Result} from '../../entities/result';
import {data} from "../../entities/data";
import {ResultsAlgorithms} from "../../algorithms/results.algorithms";

@Component({
  selector: 'table-page',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  results: Result[] = [];

  constructor(private algorithm: ResultsAlgorithms) { }

  ngOnInit(): void {
    this.algorithm.getAll().subscribe(results => {
      this.results = results;
    })
  }

}
