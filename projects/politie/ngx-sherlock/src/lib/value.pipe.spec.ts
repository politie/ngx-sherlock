import { ChangeDetectorRef } from '@angular/core';
import { atom, DerivableAtom } from '@politie/sherlock';
import { ProxyDescriptor } from '@politie/sherlock-proxy';
import { getObservers } from './utils.spec';
import { ValuePipe } from './value.pipe';

describe('ValuePipe', () => {

    let ref: ChangeDetectorRef;
    let pipe: ValuePipe<any>;
    let emitter: DerivableAtom<any>;
    let proxy: any;

    beforeEach(() => {
        ref = jasmine.createSpyObj<ChangeDetectorRef>('ref', ['markForCheck']);
        pipe = new ValuePipe(ref);
        emitter = atom.unresolved();
        proxy = new ProxyDescriptor().$create(emitter);
    });

    describe('#transform', () => {
        it('should return the input when not provided with a Derivable or DerivableProxy', () => {
            expect(pipe.transform('foo' as any)).toBe('foo');
        });

        it('should do nothing when not given a parameter', () => {
            expect(pipe.transform(undefined as any)).toBeUndefined();
        });

        it('should return the current value of a Derivable', () => {
            emitter.set('here I am!');
            expect(pipe.transform(emitter)).toBe('here I am!');
        });

        it('should not throw on unresolved derivables', () => {
            expect(pipe.transform(emitter)).toBeUndefined();
            emitter.set('here I am!');
            expect(pipe.transform(emitter)).toBe('here I am!');
        });

        it('should return the current value of a DerivableProxy', () => {
            emitter.set({ prop: 'here I am!' });
            expect(pipe.transform(proxy.prop)).toBe('here I am!');
        });

        it('should dispose of the existing reaction when reacting to a new derivable', () => {
            pipe.transform(emitter);

            expect(getObservers(emitter).length).toBe(1, 'original emitter should have been observed');

            const newEmitter = atom.unresolved();
            expect(pipe.transform(newEmitter)).toBe(undefined);

            emitter.set('newer value'); // this should not affect the pipe instance
            expect(getObservers(emitter).length).toBe(0, 'original emitter should not have an observer anymore');
            expect(getObservers(newEmitter).length).toBe(1, 'new emitter should have an observer');
        });

        it('should request a change detection check upon recieving a new value', () => {
            pipe.transform(emitter);

            expect(ref.markForCheck).not.toHaveBeenCalled();

            emitter.set('do check');

            expect(ref.markForCheck).toHaveBeenCalled();
        });
    });

    describe('#ngOnDestroy', () => {
        it('should do nothing when there is no reaction', () => {
            expect(() => pipe.ngOnDestroy()).not.toThrow();
        });

        it('should unsubscribe on the derivable', () => {
            pipe.transform(emitter);
            expect(getObservers(emitter).length).toBe(1, 'should have one observer');

            pipe.ngOnDestroy();
            expect(getObservers(emitter).length).toBe(0, 'should not have an observer anymore');
        });
    });
});
