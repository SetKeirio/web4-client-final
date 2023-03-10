import { Injectable } from '@angular/core';
import {User} from '../entities/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ExceptionMessageRequest} from "../entities/expection.message.request";


@Injectable({
  providedIn: 'root'
})
export class LoginAlgorithm {
  execChange: Subject<ExceptionMessageRequest> = new Subject<ExceptionMessageRequest>();

  private HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  readonly REST_API_AUTH = 'http://localhost:8080/lab4_335099_backend/rest/login';

  private token: ExceptionMessageRequest;
  private message: string = "";

  constructor(private http: HttpClient) { }

  tokenChange(data: ExceptionMessageRequest) {
    //this.execChange.next(data);

  }

  login(user: User): Observable<{token: string}> {
    const data = {username: user.login, password: user.password, registration: false};
    return this.http.post<{token: string}>(this.REST_API_AUTH, data).pipe(
      tap(
    ({token}) => {
        console.log(token);
        //this.tokenChange(token);
        //this.token = token;
        localStorage.setItem('auth-token', token);
        this.getData("auth-token");
      }
    )
    );
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    return data;
  }

  register(user: User): Observable<{token: string}>{
    const data = {username: user.login, password: user.password, registration: true};
    return this.http.post<{token: string}>(this.REST_API_AUTH, data).pipe(
        tap(
            ({token}) => {
              //console.log(token);
              //localStorage.setItem('auth-token', token.token);
              //this.tokenChange(token);
              //this.token = token;
              //console.log(this.token);
              localStorage.setItem('auth-token', token);
              //console.log(this.getData('auth-token'));
            }
        )
    );

  }

  public setToken(token: string): void {
    //this.execChange.next(token);
  }

  public getToken(): string {
    return this.token.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token.token;
  }

  public logaout(): void {
    let temp = new ExceptionMessageRequest();
    temp.token = "";
    temp.message = "";
    this.tokenChange(temp);
    this.setToken("");
    localStorage.clear();
  }

}
