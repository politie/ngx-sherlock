import { CommonModule } from '@angular/common';
import { Component, DebugElement, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Atom, atom } from '@politie/sherlock';
import { DerivableProxy, ProxyDescriptor } from '@politie/sherlock-proxy';
import { NgxSherlockFormsModule } from '../ngx-sherlock-forms.module';
import { DefaultValueAccessor } from './DefaultValueAccessor';

describe('NgxSherlockFormsModule', () => {
    describe('accessors', () => {
        describe('DefaultValueAccessor', () => {
            let component: TestComponent;
            let fixture: ComponentFixture<TestComponent>;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    imports: [NgxSherlockFormsModule, CommonModule, ReactiveFormsModule, FormsModule],
                    declarations: [TestComponent],
                }).compileComponents();
            });

            beforeEach(() => {
                fixture = TestBed.createComponent(TestComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
            });

            describe('Template driven', () => {
                let input: DebugElement;

                beforeEach(async () => {
                    // IMPORTANT to wait for async events triggered by NgModel updates.
                    await fixture.whenStable();
                    input = getInput(fixture, '#template-input');
                });

                it('should correctly display the atom value', async () => {
                    expect(input.nativeElement.value).toEqual(component.value$.get());
                });

                it('should pass values to atom when input value changes', () => {
                    input.triggerEventHandler('input', buildInput('My new value'));
                    fixture.detectChanges();
                    expect(component.value$.get()).toEqual('My new value');
                });

                it('should set input value when atom changes', () => {
                    component.value$.set('My value from atom');
                    fixture.detectChanges();
                    expect(input.nativeElement.value).toEqual('My value from atom');
                    expect(component.templateForm.value).toEqual({ atom: 'My value from atom' });
                });

                it('should apply validators when input changes', async () => {
                    component.isRequired = true;
                    input.triggerEventHandler('input', buildInput(''));
                    fixture.detectChanges();
                    expect(component.templateForm.valid).toBe(false);
                    expect(component.templateForm.hasError('required', ['atom'])).toBe(true);
                });

                it('should apply validators when state changes', () => {
                    component.isRequired = true;
                    component.value$.set('');
                    fixture.detectChanges();
                    expect(component.templateForm.valid).toBe(false);
                    expect(component.templateForm.hasError('required', ['atom'])).toBe(true);
                });
            });

            describe('Reactive (with proxy)', () => {
                let input: DebugElement;

                beforeEach(async () => {
                    component.templateDriven = false;
                    fixture.detectChanges();
                    await fixture.whenStable();
                    input = getInput(fixture, '#reactive-input');
                });

                it('should correctly display proxied value', () => {
                    expect(input.nativeElement.value).toEqual('myProxyValue');
                });

                it('should pass values to proxy when input changes', () => {
                    input.triggerEventHandler('input', buildInput('My proxy value changed'));
                    fixture.detectChanges();
                    expect(component.proxiedProp.$value).toEqual('My proxy value changed');
                });

                it('should set input when proxy value changes', () => {
                    component.proxiedProp.$value = 'My value from state';
                    fixture.detectChanges();
                    expect(input.nativeElement.value).toEqual('My value from state');
                });

                it('should correctly execute validators when input changes', () => {
                    const len = 10;
                    component.form.get('proxy').setValidators(Validators.minLength(len));
                    component.form.updateValueAndValidity();

                    input.triggerEventHandler('input', buildInput('x'.repeat(len + 5)));
                    fixture.detectChanges();
                    expect(component.form.valid).toBe(true);

                    input.triggerEventHandler('input', buildInput('x'.repeat(len - 5)));
                    fixture.detectChanges();
                    expect(component.form.valid).toBe(false);
                    expect(component.form.get('proxy').hasError('minlength')).toBe(true);
                });

                it('should correctly execute validators when proxy changes', () => {
                    const len = 10;
                    component.form.get('proxy').setValidators(Validators.maxLength(len));
                    component.form.updateValueAndValidity();

                    component.proxiedProp.$value = 'x'.repeat(len - 5);
                    fixture.detectChanges();
                    expect(component.form.valid).toBe(true);

                    component.proxiedProp.$value = 'x'.repeat(len + 5);
                    fixture.detectChanges();
                    expect(component.form.valid).toBe(false);
                    expect(component.form.get('proxy').hasError('maxlength')).toBe(true);
                });
            });

            describe('#onTouched', () => {
                let onTouchedSpy: jasmine.Spy;
                let directive: DefaultValueAccessor;
                let input: DebugElement;

                beforeEach(async () => {
                    await fixture.whenStable();
                    const el = fixture.debugElement.query(By.directive(DefaultValueAccessor));
                    directive = el.injector.get(DefaultValueAccessor);
                    onTouchedSpy = spyOn(directive, 'onTouched' as any).and.callThrough();
                    input = getInput(fixture, '#template-input');
                });

                it('should call #onTouched on BaseValueAccessor when blur event happens', () => {
                    input.triggerEventHandler('blur', null);
                    fixture.detectChanges();
                    expect(onTouchedSpy).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});

@Component({
    template: `
    <div id="template" *ngIf="templateDriven">
        <form #templateForm="ngForm">
            <input id="template-input"
                type="text" name="atom"
                enableSherlock
                [(ngModel)]="value$"
                [required]="isRequired">
        </form>
    </div>
    <div id="reactive" *ngIf="!templateDriven">
        <div [formGroup]="form">
            <input type="text"
                id="reactive-input"
                enableSherlock
                formControlName="proxy">
        </div>
    </div>
    `,
})
export class TestComponent {
    templateDriven = true;
    isRequired = false;
    value$: Atom<string> = atom('myAtomValue');
    objectProxy$: DerivableProxy<{ myProp: string }> = new ProxyDescriptor().$create(atom({ myProp: 'myProxyValue' }));
    @ViewChild('templateForm') templateForm: NgForm;
    form: FormGroup;

    get proxiedProp(): DerivableProxy<string> {
        return (this.objectProxy$ as any).myProp;
    }

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            proxy: (this.objectProxy$ as any).myProp,
        });
    }
}

function getInput(fixture: ComponentFixture<TestComponent>, selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
}

function buildInput(input: string) {
    return { target: { value: input } };
}
