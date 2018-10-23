import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSherlockModule } from '@politie/ngx-sherlock';
import { AppComponent } from './app.component';
import { AutoChangeDetectionServiceComponent } from './auto-change-detection-service/auto-change-detection-service.component';
import { ValuePipeComponent } from './value-pipe/value-pipe.component';

@NgModule({
    declarations: [
        AppComponent,
        AutoChangeDetectionServiceComponent,
        ValuePipeComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgxSherlockModule,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
