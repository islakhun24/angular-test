import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputAComponent } from './components/input-a/input-a.component';
import { OnlyNumberDirective } from './directive/onlyNumber.directive';
import { InputUrlComponent } from './components/input-url/input-url.component';

@NgModule({
  declarations: [
    AppComponent,
    InputAComponent,
    OnlyNumberDirective,
    InputUrlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
