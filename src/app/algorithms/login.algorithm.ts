import { Injectable } from '@angular/core';
import {User} from '../entities/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginAlgorithm {

  private HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  readonly REST_API_AUTH = 'http://localhost:8080/lab4_335099_backend/rest/login';

  private token: string = "";

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>(this.REST_API_AUTH, user, this.HTTP_OPTIONS)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token);
            this.setToken(token);
          }
        )
      );
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public logaout(): void {
    this.setToken("");
    localStorage.clear();
  }

  public register(user: User){
    return this.http.post(this.REST_API_AUTH, user, this.HTTP_OPTIONS);
  }
}
