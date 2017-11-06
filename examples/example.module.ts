import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxSherlockModule } from '../src';
import { ExampleComponent } from './example.component';

@NgModule({
    declarations: [
        ExampleComponent,
    ],
    imports: [
        BrowserModule,
        NgxSherlockModule,
    ],
    providers: [],
    bootstrap: [ExampleComponent],
})
export class ExampleModule { }
