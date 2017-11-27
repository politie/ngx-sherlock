import { ChangeDetectorRef } from '@angular/core';
import { atom } from '@politie/sherlock';
import { autoDetectChanges } from './auto-detect-changes';

describe('change detection', () => {
    describe('autoDetectChanges', () => {
        let cdr: MockChangeDetectorRef;

        beforeEach(() => {
            cdr = new MockChangeDetectorRef();
            autoDetectChanges(cdr as any);
        });

        it('should throw when an invalid ChangeDetectorRef is passed', () => {
            expect(() => autoDetectChanges({} as any)).toThrowError('autoDetectChanges was not called with a valid ChangeDetectorRef.');
        });

        it('should call cdr#onDestroy with a destroyer function', () => {
            expect(typeof cdr.destroyer).toEqual('function');
            expect((cdr.internal$ as any).observers.length).toEqual(1);
            cdr.destroyer();
            expect((cdr.internal$ as any).observers.length).toEqual(0);
        });

        it('should call cdr#detectChanges when any internal derivable state changes', () => {
            expect(cdr.detectChanges).toHaveBeenCalledTimes(1);
            cdr.internal$.set('new value');
            expect(cdr.detectChanges).toHaveBeenCalledTimes(2);
        });
    });
});

class MockChangeDetectorRef {
    readonly internal$ = atom('value');
    destroyer: () => void;

    detectChanges = jasmine.createSpy('detectChanges').and.callFake(() => this.internal$.get());
    onDestroy = jasmine.createSpy('onDestroy').and.callFake((fn: () => void) => this.destroyer = fn);
}
