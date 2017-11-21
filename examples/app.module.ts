import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSherlockFormsModule, NgxSherlockModule } from '../src';

import { AppComponent } from './app.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { UtilsService } from './utils.service';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
    declarations: [
        AppComponent,
        NavigatorComponent,
        ViewerComponent,
    ],
    imports: [
        BrowserModule,
        NgxSherlockModule,
        NgxSherlockFormsModule,
        FormsModule,
    ],
    providers: [UtilsService],
    bootstrap: [AppComponent],
})
export class AppModule { }
