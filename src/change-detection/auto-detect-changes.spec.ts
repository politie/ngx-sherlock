import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { atom } from '@politie/sherlock';
import { ProxyDescriptor } from '@politie/sherlock-proxy';
import { autoDetectChanges } from './auto-detect-changes';

describe('change detection', () => {
    describe('autoDetectChanges', () => {
        let fixture: ComponentFixture<TestComponent>;
        let component: TestComponent;
        let detectChangesSpy: jasmine.Spy;
        let onDestroySpy: jasmine.Spy;
        let detachSpy: jasmine.Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({ imports: [CommonModule], declarations: [TestComponent] }).compileComponents();
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            detectChangesSpy = spyOn(component.cdr, 'detectChanges').and.callThrough();
            onDestroySpy = spyOn(component.cdr as any, 'onDestroy').and.callThrough();
            detachSpy = spyOn(component.cdr as any, 'detach').and.callThrough();

            fixture.detectChanges();
        });

        it('should throw when no ChangeDetectorRef is provided', () => {
            expect(() => autoDetectChanges({} as any)).toThrowError(`autoDetectChanges was not called with a valid ChangeDetectorRef.`);
        });

        it('should rethrow when #detectChanges errors', () => {
            detectChangesSpy.and.callFake(() => { throw new Error('error in change detection'); });
            expect(() => component.state$.set('this should error')).toThrowError('Error: error in change detection');
            expect(detachSpy).toHaveBeenCalled();
        });

        it('should have registered a reaction destroying function with the ChangeDetectorRef', () => {
            expect(onDestroySpy).toHaveBeenCalledTimes(1);
            // tslint:disable-next-line:ban-types
            const destroyer: Function = onDestroySpy.calls.mostRecent().args[0];
            expect(typeof destroyer).toEqual('function');
            expect(destroyer.name).toEqual('done');
        });

        it('should have called ChangeDetectorRef#detectChanges once on initialization', () => {
            expect(detectChangesSpy).toHaveBeenCalledTimes(1);
        });

        describe('using Derivable', () => {
            // let's reset detectChangesSpy so we start out with zero calls.
            beforeEach(() => detectChangesSpy.calls.reset());

            it('should correctly render state on initialization', () => {
                expect(getH1Text(fixture)).toContain(component.state$.get());
            });

            it('should call ChangeDetectorRef#detectChanges when state changes', () => {
                component.state$.set('new value');
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);
                expect(getH1Text(fixture)).toContain('new value');

                component.state$.set('newer value');
                expect(detectChangesSpy).toHaveBeenCalledTimes(2);
                expect(getH1Text(fixture)).toContain('newer value');
            });

            it('should stop reaction when component gets destroyed', () => {
                component.state$.set('foo');
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);

                // Destroy component
                fixture.destroy();

                component.state$.set('bar');
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('using DerivableProxy', () => {
            // Set component to 'proxy mode' and reset detectChangesSpy call count.
            beforeEach(() => {
                component.useProxy$.set(true);
                detectChangesSpy.calls.reset();
            });

            it('should correctly render state on initialization', () => {
                expect(getH1Text(fixture)).toBe(component.state$.derive(v => v.toUpperCase()).get());
            });

            it('should correctly render when underlying atom changes', () => {
                component.state$.set('foobar');
                expect(getH1Text(fixture)).toBe('FOOBAR');
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);
            });

            it('should correctly render when $value is set and call ChangeDetectorRef#detectChanges', () => {
                component.proxyState$.$value = 'Set via $value';
                expect(getH1Text(fixture)).toBe('SET VIA $VALUE');
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);

                component.proxyState$.$value = 'new value for $value';
                expect(getH1Text(fixture)).toBe('NEW VALUE FOR $VALUE');
                expect(detectChangesSpy).toHaveBeenCalledTimes(2);
            });

            it('should stop detecting changes when component gets destroyed', () => {
                component.proxyState$.$value = 'foo';
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);

                fixture.destroy();

                component.proxyState$.$value = 'bar';
                expect(detectChangesSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});

@Component({
    template: `
    <h1 *ngIf="!useProxy">{{state}}</h1>
    <h1 *ngIf="useProxy">{{proxyState$.$value}}</h1>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent implements OnInit {
    readonly state$ = atom('my value');
    readonly proxyState$ = new ProxyDescriptor().$create(this.state$.lens({
        get: v => v.toUpperCase(),
        set: v => v.toLowerCase(),
    }));

    readonly useProxy$ = atom(false);

    get state() { return this.state$.get(); }
    get useProxy() { return this.useProxy$.get(); }

    constructor(readonly cdr: ChangeDetectorRef) { }

    ngOnInit() {
        autoDetectChanges(this.cdr);
    }
}

function getH1Text(fixture: ComponentFixture<TestComponent>): string {
    return fixture.debugElement.query(By.css('h1')).nativeElement.textContent.trim();
}
