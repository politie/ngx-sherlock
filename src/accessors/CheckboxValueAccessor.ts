import { Directive, HostListener } from '@angular/core';
import { BaseValueAccessor } from './BaseValueAccessor';

@Directive({
    selector: 'input[type=checkbox][enableSherlock]',
    host: {
        '[attr.disabled]': 'disabled ? "" : null',
    },
})
export class CheckboxValueAccessor extends BaseValueAccessor<boolean> {
    @HostListener('blur')
    protected setOnTouched(): void {
        this.onTouched();
    }

    @HostListener('change', ['$event.target.checked'])
    protected writeValueToState(value: boolean) {
        this.setInternalState$(value);
    }

    protected writeValueToView(value: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', value);
    }
}
