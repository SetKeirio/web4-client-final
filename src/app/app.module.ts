import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {EmptyComponent} from "./objects/empty/empty.component";
import {Routes, RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {HatComponent} from "./objects/hat/hat.component";
import {LoginComponent} from "./objects/login/login.component";
import {GraphComponent} from "./objects/graph/graph.component";
import {MainComponent} from "./objects/main/main.component";
import {FormComponent} from "./objects/form/form.component";
import {TableComponent} from "./objects/table/table.component";
import {ResultComponent} from "./objects/result/result.component";
import {ResultsAlgorithms} from "./algorithms/results.algorithms";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {LoginAlgorithm} from "./algorithms/login.algorithm";

@NgModule({
  declarations: [
    AppComponent,
    EmptyComponent,
    HatComponent,
    LoginComponent,
    GraphComponent,
    FormComponent,
    TableComponent,
    ResultComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [LoginAlgorithm],
  bootstrap: [AppComponent]
})
export class AppModule { }
