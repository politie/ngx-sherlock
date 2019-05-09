import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { derivableQueryList } from './derivable-query-list';

describe('DerivableQueryList', () => {

    @Component({
        template: `
            <p #p *ngIf="first">First</p>
            <p #p *ngIf="second">Second</p>
            <p #p *ngIf="third">Third</p>
        `,
    })
    class TestComponent {
        first = true;
        second = false;
        third = false;

        @ViewChildren('p')
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

    it('resolve after initialized', () => {
        expect(componentInstance.paragraphs$.resolved).toBeFalsy();
        componentInstance.paragraphs$.markInitialized();
        expect(componentInstance.paragraphs$.resolved).toBeTruthy();
    });

    it('derive the viewChildrens', () => {
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
});
