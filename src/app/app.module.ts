import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSherlockModule } from '@politie/ngx-sherlock';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoDetectedComponent } from './auto-detected/auto-detected.component';
import { ValuePipeComponent } from './value-pipe/value-pipe.component';
import { MaterialSharedModule } from './material-shared/material-shared.module';

@NgModule({
    declarations: [
        AppComponent,
        AutoDetectedComponent,
        ValuePipeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgxSherlockModule,
        MaterialSharedModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
