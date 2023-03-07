import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Result} from "../entities/result";
import {Request} from "../entities/request";

@Injectable({
  providedIn: 'root'
})

export class ResultsAlgorithms{
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Result[]>{
    return this.http.get<Result[]>("http://localhost:8080/lab4_335099_backend/rest/results")
  }

  addOne(result: Request, clicked: boolean){
    const data = {x: result.x, y: result.y, r: result.r, fromCanvas: clicked};
    return this.http.post("http://localhost:8080/lab4_335099_backend/rest/results", data)
  }
}


