import { Directive, HostListener } from '@angular/core';
import { BaseValueAccessor } from './BaseValueAccessor';

@Directive({
    selector: 'input[enableSherlock]:not([type=checkbox]),textarea[enableSherlock]',
    host: {
        '[attr.disabled]': 'disabled ? "" : null',
    },
})
export class DefaultValueAccessor extends BaseValueAccessor<string> {

    @HostListener('blur')
    protected setOnTouched() {
        this.onTouched();
    }

    @HostListener('input', ['$event.target.value'])
    protected writeValueToState(value: string) {
        this.setInternalState$(value);
    }

    protected writeValueToView(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }
}
