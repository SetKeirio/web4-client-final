import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthAlgorithm} from "../../algorithms/auth.algorithm";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginAlgorithm} from "../../algorithms/login.algorithm";
import {Injectable}             from '@angular/core';
import {Subject}                from 'rxjs';

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent{


  execChange: Subject<string> = new Subject<string>();
  private authSubscription: Subscription;
  message: string;
  err: boolean;
  userForm: FormGroup;

  constructor(private auth: LoginAlgorithm,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userForm = new FormGroup( {
      login: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onLogin(): void{
    this.userForm.disable();
    this.authSubscription = this.auth.login(this.userForm.value).subscribe(
      () => this.router.navigate(['/main']),
      error => {
        console.log(error);
        this.err = true;
        this.message = error.error.message;
        //alert(error.error.message);
        this.userForm.enable();
      }
    );

  }

  onRegister(): void{
    this.userForm.disable();
    this.authSubscription = this.auth.register(this.userForm.value).subscribe(
      () => {
        this.router.navigate(['/main'])
      },
      error => {
        console.log(error);
        this.err = true;
        this.message = error.error.message;
        //alert(error.error.message);
        this.userForm.enable();
      }
    );

  }

}
