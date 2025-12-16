import { NgModule } from '@angular/core';
import { ValueForPipe } from './value-for.pipe';
import { ValuePipe } from './value.pipe';

/**
 * This module is for compatibility with non-standalone applications.
 * Standalone applications can import the pipes directly.
 */
@NgModule({
    imports: [
        ValueForPipe,
        ValuePipe,
    ],
    exports: [
        ValueForPipe,
        ValuePipe,
    ],
})
export class NgxSherlockModule { }
