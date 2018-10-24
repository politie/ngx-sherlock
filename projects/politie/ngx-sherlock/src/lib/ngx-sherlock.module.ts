import { NgModule } from '@angular/core';
import { ValuePipe } from './value.pipe';

@NgModule({
    declarations: [
        ValuePipe,
    ],
    exports: [
        ValuePipe,
    ],
})
export class NgxSherlockModule { }
