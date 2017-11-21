import { NgModule } from '@angular/core';
import { CheckboxValueAccessor, DefaultValueAccessor } from './accessors';

export const SHERLOCK_ACCESSORS = [
    CheckboxValueAccessor,
    DefaultValueAccessor,
];

@NgModule({
    declarations: [...SHERLOCK_ACCESSORS],
    exports: [...SHERLOCK_ACCESSORS],
})
export class NgxSherlockFormsModule { }
