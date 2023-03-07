import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmptyComponent} from "./objects/empty/empty.component";
import {LoginComponent} from "./objects/login/login.component";
import {MainComponent} from "./objects/main/main.component";

const path: Routes = [{path: '', redirectTo: "/authentify", pathMatch: "full"},
  {path: 'authentify', component: LoginComponent},
  {path: 'register', component: EmptyComponent},
  {path: 'main', component: MainComponent},
  {path: '**', component: EmptyComponent}];

@NgModule({
  imports: [RouterModule.forRoot(path)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
