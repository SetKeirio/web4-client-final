import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LoginAlgorithm} from './login.algorithm';

@Injectable({
  providedIn: 'root'
})
export class AuthAlgorithm implements CanActivate {
  constructor(private router: Router, private auth2: LoginAlgorithm) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.auth2.isAuthenticated()) {
      return of(true);
    } else {
      //this.router.navigate(['/login']);
      return of(false);
    }
  }
}
