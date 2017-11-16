import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSherlockModule } from '../src'; // Local .tgz module

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
    ],
    providers: [UtilsService],
    bootstrap: [AppComponent],
})
export class AppModule { }
