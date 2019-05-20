import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { derivableQueryList } from './derivable-query-list';

describe('DerivableQueryList', () => {

    @Component({
        template: `
            <p #item *ngIf="first">First</p>
            <p #item *ngIf="second">Second</p>
            <p #item *ngIf="third">Third</p>
        `,
    })
    class TestComponent {
        first = true;
        second = false;
        third = false;

        @ViewChildren('item')
        private readonly paragraphs!: QueryList<ElementRef<HTMLParagraphElement>>;
        readonly paragraphs$ = derivableQueryList(() => this.paragraphs);
    }

    beforeEach(() => TestBed.configureTestingModule({ declarations: [TestComponent] }).compileComponents());

    let fixture: ComponentFixture<TestComponent>;
    let componentInstance: TestComponent;

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        ({ componentInstance } = fixture);
        fixture.detectChanges();
    });

    it('should be resolved after initialization', () => {
        expect(componentInstance.paragraphs$.resolved).toBeFalsy();
        componentInstance.paragraphs$.markInitialized();
        expect(componentInstance.paragraphs$.resolved).toBeTruthy();
    });

    it('should not throw if called twice', () => {
        expect(componentInstance.paragraphs$.resolved).toBeFalsy();
        componentInstance.paragraphs$.markInitialized();
        componentInstance.paragraphs$.markInitialized();
        expect(componentInstance.paragraphs$.resolved).toBeTruthy();
    });

    it('should expose the viewChildren in a Derivable', () => {
        componentInstance.paragraphs$.markInitialized();
        expect(componentInstance.paragraphs$.get().length).toEqual(1);

        componentInstance.second = true;
        fixture.detectChanges();
        expect(componentInstance.paragraphs$.get().length).toEqual(2);

        componentInstance.third = true;
        fixture.detectChanges();
        expect(componentInstance.paragraphs$.get().length).toEqual(3);

        componentInstance.first = false;
        componentInstance.second = false;
        componentInstance.third = false;
        fixture.detectChanges();
        expect(componentInstance.paragraphs$.get().length).toEqual(0);

    });

    it('should be able to react to changes in the viewChildren', () => {
        let paragraphs!: number;
        componentInstance.paragraphs$.react(v => paragraphs = v.length);

        componentInstance.paragraphs$.markInitialized();
        expect(paragraphs).toEqual(1);

        componentInstance.second = true;
        fixture.detectChanges();
        expect(paragraphs).toEqual(2);

        componentInstance.third = true;
        fixture.detectChanges();
        expect(paragraphs).toEqual(3);
    });
});
