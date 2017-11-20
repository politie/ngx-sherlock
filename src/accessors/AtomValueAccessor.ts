import { Directive, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Atom, isDerivable } from '@politie/sherlock';

@Directive({
    selector: '[atomValue]',
    host: {
        '[attr.disabled]': 'disabled ? "" : null',
    },
})
export class AtomValueAccessor<T, K> implements ControlValueAccessor, OnDestroy, OnInit {

    disabled: boolean;
    private atom$: Atom<T>;
    private control: AbstractControl;

    @HostListener('blur')
    private onTouched: () => void;
    private done: () => void;

    constructor(
        @Self() private readonly controlDir: NgControl,
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2,
    ) {
        this.controlDir.valueAccessor = this;
    }

    ngOnInit(): void {
        this.control = this.controlDir.control;
    }

    ngOnDestroy(): void {
        this.done && this.done();
    }

    writeValue(value: Atom<T> | T): void {
        if (value) {
            if (isDerivable(value)) {
                this.atom$ = value;
                this.done = this.atom$.react(v => {
                    this.control.setValue(v, { emitModelToViewChange: false, emitViewToModelChange: false });
                    this.setElement(v);
                });
            } else {
                this.setElement(value);
            }
        }
    }

    registerOnChange(fn: any): void {
        return;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', this.disabled);
    }

    @HostListener('input', ['$event.target.value'])
    private writeAtomValue(value: T) {
        this.atom$.set(value);
    }

    private setElement(value: T) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }
}
