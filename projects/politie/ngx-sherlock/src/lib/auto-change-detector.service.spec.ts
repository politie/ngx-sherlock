import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { atom } from '@politie/sherlock';
import { DerivableProxy, ProxyDescriptor } from '@politie/sherlock-proxy';
import { AutoChangeDetectorService } from './auto-change-detector.service';
import { getObservers } from './utils.spec';

describe('AutoChangeDetectorService', () => {

    @Component({
        template: `
            <p *ngIf="!enableProxy$.value">{{ state$.value?.myProp }}</p>
            <p *ngIf="enableProxy$.value">proxy: {{ proxyState$.myProp.$value }}</p>
            {{ spy() }}
        `,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            AutoChangeDetectorService,
        ],
    })
    class TestComponent {
        readonly state$ = atom({ myProp: 'my value' });
        readonly proxyState$ = new ProxyDescriptor().$create(this.state$) as DerivableProxy<{ myProp: string }> & { myProp: DerivableProxy<string> };
        readonly enableProxy$ = atom(false);

        spy() { }

        constructor(autoCD: AutoChangeDetectorService, readonly cd: ChangeDetectorRef) { autoCD.init(); }
    }

    beforeEach(() => TestBed.configureTestingModule({ declarations: [TestComponent] }).compileComponents());

    let fixture: ComponentFixture<TestComponent>;
    let componentInstance: TestComponent;
    let nativeElement: HTMLElement;
    let spy: jasmine.Spy;

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        ({ componentInstance, nativeElement } = fixture);
        spy = spyOn(componentInstance, 'spy');
    });

    it('should detach the change detector immediately and start the auto change detection after a tick', () => {
        // Spy is installed after creation of component, so we simply create a new instance of the service to test this
        // behavior.
        const changeDetectorRef = jasmine.createSpyObj<ChangeDetectorRef>('changeDetectorRef', ['detach', 'onDestroy']);
        new AutoChangeDetectorService(changeDetectorRef);
        expect(changeDetectorRef.detach).toHaveBeenCalled();
    });

    it('should throw when not given a ViewRef as ChangeDetectorRef', () => {
        const changeDetectorRef = jasmine.createSpyObj<ChangeDetectorRef>('changeDetectorRef', ['detach']);
        expect(() => new AutoChangeDetectorService(changeDetectorRef)).toThrowError(/AutoChangeDetectorService will not work correctly/);
    });

    it('should not start the auto change detection until after a tick', () => {
        expect(nativeElement.textContent).not.toContain('my value');
        expect(spy).not.toHaveBeenCalled();
    });

    describe('after init', () => {
        beforeEach(async done => {
            // Wait a tick.
            await Promise.resolve();
            done();
        });

        it('should have started the auto change detection', () => {
            expect(nativeElement.textContent).toContain('my value');
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('should have registered an observer with the atom', () => {
            expect(getObservers(componentInstance.state$).length).toBe(1, 'should have registered an observer');
        });

        it('should auto update debounced', fakeAsync(() => {
            const prop = componentInstance.state$.pluck('myProp');
            prop.set('a new value');
            prop.set('another new value');
            prop.set('yet another new value');
            expect(nativeElement.textContent).toContain('my value');
            expect(spy).toHaveBeenCalledTimes(1);
            tick();
            expect(spy).toHaveBeenCalledTimes(2);
            expect(nativeElement.textContent).toContain('yet another new value');
        }));

        describe('using DerivableProxy', () => {
            beforeEach(fakeAsync(() => {
                componentInstance.enableProxy$.set(true);
                tick();
            }));

            it('should just work', fakeAsync(() => {
                expect(nativeElement.textContent).toContain('proxy: my value');
                expect(spy).toHaveBeenCalledTimes(2);

                componentInstance.proxyState$.myProp.$value = 'insert movie quote here';
                tick();

                expect(nativeElement.textContent).toContain('proxy: insert movie quote here');
                expect(spy).toHaveBeenCalledTimes(3);
            }));
        });

        describe('after being destroyed', () => {
            beforeEach(() => fixture.destroy());

            it('should stop the observation', () => {
                expect(getObservers(componentInstance.state$).length).toBe(0, 'should have removed all observers');
            });
        });
    });
});
