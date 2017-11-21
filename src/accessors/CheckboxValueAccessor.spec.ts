import { CommonModule } from '@angular/common';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { atom } from '@politie/sherlock';
import { NgxSherlockFormsModule } from '../ngx-sherlock-forms.module';
import { CheckboxValueAccessor } from './CheckboxValueAccessor';

describe('NgxSherlockFormsModule', () => {
    describe('accessors', () => {
        describe('CheckboxValueAccessor', () => {
            let component: TestComponent;
            let fixture: ComponentFixture<TestComponent>;
            let input: DebugElement;

            beforeEach(() => {
                TestBed.configureTestingModule({
                    imports: [NgxSherlockFormsModule, CommonModule, FormsModule],
                    declarations: [TestComponent],
                }).compileComponents();
            });

            beforeEach(() => {
                fixture = TestBed.createComponent(TestComponent);
                component = fixture.componentInstance;
                fixture.detectChanges();
            });

            beforeEach(async () => {
                // IMPORTANT to wait for async events triggered by NgModel updates.
                await fixture.whenStable();
                input = getInput(fixture, '#checkbox-input');
            });

            it('should correctly display the atom value', () => {
                expect(input.nativeElement.checked).toBe(false);
            });

            it('should update the atom when input value changes', () => {
                input.triggerEventHandler('change', buildInput(true));
                fixture.detectChanges();
                expect(component.booleanVal$.get()).toBe(true);
            });

            it('should update the input value when the atom changes', () => {
                component.booleanVal$.set(true);
                fixture.detectChanges();
                expect(input.nativeElement.checked).toBe(true);
            });

            it('should handle validation', () => {
                component.requiredTrue = true;
                fixture.detectChanges();
                expect(component.form.valid).toBe(false);

                input.triggerEventHandler('change', buildInput(true));
                fixture.detectChanges();
                expect(component.form.valid).toBe(true);
            });

            it('should handle blur', () => {
                const directive = fixture.debugElement.query(By.directive(CheckboxValueAccessor)).injector.get(CheckboxValueAccessor);
                const touchedSpy = spyOn(directive, 'onTouched' as any).and.callThrough();
                input.triggerEventHandler('blur', null);
                expect(touchedSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});

@Component({
    template: `
        <form #form="ngForm">
        <input name="checkbox" type="checkbox" enableSherlock id="checkbox-input" [(ngModel)]="booleanVal$" [required]="requiredTrue">
        </form>
    `,
})
export class TestComponent {
    requiredTrue = false;
    booleanVal$ = atom(false);
    @ViewChild('form') form: NgForm;
}

function getInput(fixture: ComponentFixture<TestComponent>, selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
}

function buildInput(input: boolean) {
    return { target: { checked: input } };
}
