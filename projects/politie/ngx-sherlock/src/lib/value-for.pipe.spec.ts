import { ChangeDetectorRef } from "@angular/core";
import { atom, DerivableAtom } from "@politie/sherlock";
import { ProxyDescriptor } from "@politie/sherlock-proxy";
import { getObservers } from "./utils.spec";
import { ValueForPipe } from "./value-for.pipe";

describe("ValueForPipe", () => {
    let cdr: jasmine.SpyObj<ChangeDetectorRef>;
    let pipe: ValueForPipe<any>;
    let emitter: DerivableAtom<any>;
    let proxy: any;

    beforeEach(() => {
        cdr = jasmine.createSpyObj("ChangeDetectorRef", ["markForCheck"]);
        pipe = new ValueForPipe(cdr);

        emitter = atom.unresolved();
        proxy = new ProxyDescriptor().$create(emitter);
    });

    describe("#transform", () => {
        it("should return undefined for unresolved Derivable", () => {
            expect(pipe.transform(emitter)).toBeUndefined();
        });

        it("should return the Derivable itself when it has a value", () => {
            emitter.set("hello");
            const result = pipe.transform(emitter);
            expect(result).toBe(emitter);
            expect((result as DerivableAtom<any>).get()).toBe("hello");
        });

        it("should return the DerivableProxy itself", () => {
            emitter.set({ prop: "proxy value" });
            const result = pipe.transform(proxy);
            expect(result!.$value).toEqual({ prop: "proxy value" });
            expect((result as any).$value.prop).toBe("proxy value");
        });

        it("should dispose the previous subscription when a new derivable is passed", () => {
            pipe.transform(emitter);
            expect(getObservers(emitter).length).toBe(1);

            const newEmitter = atom.unresolved();
            pipe.transform(newEmitter);

            expect(getObservers(emitter).length).toBe(0);
            expect(getObservers(newEmitter).length).toBe(1);
        });

        it("should call markForCheck when derivable updates", () => {
            pipe.transform(emitter);

            emitter.set("new value");

            expect(cdr.markForCheck).toHaveBeenCalled();
        });
    });

    describe("#ngOnDestroy", () => {
        it("should not throw when no subscription exists", () => {
            expect(() => pipe.ngOnDestroy()).not.toThrow();
        });

        it("should unsubscribe from the derivable", () => {
            pipe.transform(emitter);
            expect(getObservers(emitter).length).toBe(1);

            pipe.ngOnDestroy();

            expect(getObservers(emitter).length).toBe(0);
        });
    });
});
