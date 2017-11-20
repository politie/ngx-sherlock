import { NgModule } from '@angular/core';
import { AtomValueAccessor } from './accessors';

export const FORM_PROVIDERS = [
    AtomValueAccessor,
];

@NgModule({
    declarations: [...FORM_PROVIDERS],
    exports: [...FORM_PROVIDERS],
})
export class NgxSherlockFormsModule { }
