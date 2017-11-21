import { ElementRef, forwardRef, Inject, OnDestroy, OnInit, Renderer2, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { Atom, isAtom } from '@politie/sherlock';
import { DerivableProxy } from '@politie/sherlock-proxy';

export abstract class BaseValueAccessor<T> implements ControlValueAccessor, OnInit, OnDestroy {

    private state$: Atom<T> | DerivableProxy<T>;
    protected disabled: boolean;
    protected onTouched: () => void;

    /**
     * Method to be called when input DOM element blurs. Use a {@link HostListener} or a {@link Directive} #host metadata property. Call
     * `BaseValueAccessor#onTouched in implementation.
     */
    protected abstract setOnTouched(): void;

    private done: () => void;
    protected control?: AbstractControl;

    constructor(
        @Inject(forwardRef(() => NgControl)) @Self() private readonly dir: NgControl,
        @Inject(forwardRef(() => ElementRef)) protected readonly elementRef: ElementRef,
        @Inject(forwardRef(() => Renderer2)) protected readonly renderer: Renderer2,
    ) {
        this.dir.valueAccessor = this;
    }

    ngOnInit() {
        this.control = this.dir.control;
    }

    ngOnDestroy() {
        this.done && this.done();
    }

    writeValue(value: Atom<T> | DerivableProxy<T> | null) {
        if (value) {
            this.state$ = value;
            isAtom(this.state$)
                ? this.done = this.state$.react(v => this.doReaction(v))
                : this.done = this.state$.$react(v => this.doReaction(v));
        }
    }

    protected setInternalState$(value: T) {
        isAtom(this.state$) ? this.state$.set(value) : this.state$.$value = value;
    }

    /**
     * Sets the value from an input element to the underlying `#state$`. Should be decorated with a {@link HostListener} or referenced
     * in a {@link Directive} #host metadata property. Call `BaseValueAccessor#setInternalState$` with the given value.
     * @param value Derivable wrapped state value.
     */
    protected abstract writeValueToState(value: T);

    /**
     * Sets a value from underlying state to the directive or component DOM element. Implementer can use `BaseValueAccessor#renderer` and to
     * `BaseValueAccessor#elementRef` to set properties on a DOM element to make the implementation platform independent.
     * @param value Value from form element.
     */
    protected abstract writeValueToView(value: T);

    registerOnChange(fn: (foo: any) => void) {
        return;
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    private doReaction(v: T) {
        if (this.control) {
            this.setControl(v);
        }
        this.writeValueToView(v);
    }

    private setControl(v: T) {
        this.control.setValue(v, { emitModelToViewChange: false, emitViewToModelChange: false });
        return this;
    }
}
