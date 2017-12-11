import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSherlockModule } from '@politie/ngx-sherlock';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSherlockModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
