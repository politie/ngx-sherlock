import { NgModule } from '@angular/core';
import { ValuePipe } from './value.pipe';
import { ValueForPipe } from './value-for.pipe';

@NgModule({
    declarations: [
        ValuePipe,
        ValueForPipe,
    ],
    exports: [
        ValuePipe,
        ValueForPipe,
    ],
})
export class NgxSherlockModule { }
