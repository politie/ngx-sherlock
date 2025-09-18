import { NgModule } from '@angular/core';
import { ValueForPipe } from './value-for.pipe';
import { ValuePipe } from './value.pipe';

@NgModule({
    declarations: [
        ValueForPipe,
        ValuePipe,
    ],
    exports: [
        ValueForPipe,
        ValuePipe,
    ],
})
export class NgxSherlockModule { }
