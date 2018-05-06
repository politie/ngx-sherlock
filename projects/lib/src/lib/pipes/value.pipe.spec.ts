import { ChangeDetectorRef, WrappedValue } from '@angular/core';
import { atom, Atom } from '@politie/sherlock';
import { DerivableProxy, ProxyDescriptor } from '@politie/sherlock-proxy';
import { DerivableProxyStrategy, DerivableStrategy, ValuePipe } from './value.pipe';

describe('NgxSherlockModule', () => {
    describe('pipes', () => {
        describe('ValuePipe', () => {

            let ref: ChangeDetectorRef;
            let pipe: ValuePipe;
            let emitter: Atom<any>;
            let strategySpy: jasmine.Spy;

            beforeEach(() => {
                ref = jasmine.createSpyObj<ChangeDetectorRef>('ref', ['markForCheck']);
                pipe = new ValuePipe(ref);
                emitter = atom(undefined);
                strategySpy = spyOn(pipe as any, 'selectStrategy').and.callThrough();
            });

            describe('#transform', () => {
                it('should throw an InvalidPipeArgumentError when not provided with a Derivable or DerivableProxy', () => {
                    expect(() => pipe.transform('foo' as any)).toThrowError('Invalid PipeArgument for pipe ValuePipe');
                });

                it('should do nothing when not given a parameter', () => {
                    expect(() => pipe.transform(undefined as any)).not.toThrow();
                });

                it('should return a wrapped version of the latest available value', () => {
                    pipe.transform(emitter);
                    emitter.set('foo');
                    expect(pipe.transform(emitter)).toEqual(new WrappedValue('foo'));
                });

                it('should return the same value when nothing has changed since the last call', () => {
                    const message = 'same value';
                    pipe.transform(emitter);
                    emitter.set(message);
                    pipe.transform(emitter);
                    expect(pipe.transform(emitter)).toBe(message);
                });

                it('should dispose of the existing reaction when reacting to a new derivable', () => {
                    pipe.transform(emitter);

                    const newEmitter = atom(undefined);
                    expect(pipe.transform(newEmitter)).toBe(undefined);

                    emitter.set('newer value'); // this should not affect the pipe instance
                    expect((emitter as any).observers.length).toBe(0, 'original emitter still has observers');
                    expect((newEmitter as any).observers.length).toBe(1, 'no observation has been taken on new emitter');
                });

                it('should request a change detection check upon recieving a new value', () => {
                    pipe.transform(emitter);
                    emitter.set('do check');

                    expect(ref.markForCheck).toHaveBeenCalled();
                });

                it('should pick the right strategy for a Derivable', () => {
                    pipe.transform(atom({ foo: 'bar' }));
                    expect(strategySpy.calls.mostRecent().returnValue).toEqual(jasmine.any(DerivableStrategy));
                    pipe.transform(createForObject({ foo: 'bar' }));
                    expect(strategySpy.calls.mostRecent().returnValue).toEqual(jasmine.any(DerivableProxyStrategy));
                });
            });

            describe('#ngOnDestroy', () => {
                it('should do nothing when there is no reaction', () => {
                    expect(() => pipe.ngOnDestroy()).not.toThrow();
                });

                it('should dispose of an existing reaction strategy', () => {
                    const spy = spyOn(pipe as any, 'dispose').and.callThrough();
                    pipe.transform(emitter);
                    pipe.ngOnDestroy();
                    expect(spy).toHaveBeenCalledTimes(1);
                    pipe.transform(createForObject('proxy'));
                    pipe.ngOnDestroy();
                    expect(spy).toHaveBeenCalledTimes(2);
                });
            });
        });
    });
});

type ProxyType<Structure, Extras = {}> = DerivableProxy<Structure>
    & { [P in keyof Structure]: ProxyType<Structure[P], Extras> }
    & Extras;

function createForObject<T>(obj: T): ProxyType<T> {
    return new ProxyDescriptor<T>().$create(atom(obj)) as ProxyType<T>;
}
