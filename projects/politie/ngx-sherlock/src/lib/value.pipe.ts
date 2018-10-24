import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Derivable, isDerivable } from '@politie/sherlock';

interface Wrapper<T> {
    derivable: Derivable<T> | DerivableProxy<T>;
    value(): T | undefined;
    unsubscribe(): void;
}

class DerivableWrapper<T> implements Wrapper<T> {
    readonly unsubscribe: () => void;
    constructor(readonly derivable: Derivable<T>, changeDetector: ChangeDetectorRef) {
        this.unsubscribe = derivable.react(() => changeDetector.markForCheck());
    }

    value() {
        return this.derivable.value;
    }
}

class DerivableProxyWrapper<T> implements Wrapper<T> {
    readonly unsubscribe: () => void;
    constructor(readonly derivable: DerivableProxy<T>, changeDetector: ChangeDetectorRef) {
        this.unsubscribe = derivable.$react(() => changeDetector.markForCheck());
    }

    value() {
        return this.derivable.$value;
    }
}

/**
 * The {@link ValuePipe} can be used to unwrap `Derivable` or `DerivableProxy` values in templates. Like Angular's
 * [AsyncPipe]{@link https://angular.io/api/common/AsyncPipe}, the
 * [ChangeDetectorRef]{@link https://angular.io/api/core/ChangeDetectorRef} of the `@Host()` component will be `markedForCheck` whenever
 * the provided value emits a new value. Usage is as follows:
 *
 * ```html
 * <!-- both title$ and someText$ are derivable values in MyComponent class -->
 * <my-component
 *   [title]="title$ | value">
 *     <p>{{someText$ | value}}</p>
 * </my-component>
 * ```
 */
@Pipe({
    name: 'value',
    pure: false,
})
export class ValuePipe<T> implements PipeTransform, OnDestroy {

    private current: Wrapper<T> | null = null;

    constructor(private readonly changeDetector: ChangeDetectorRef) { }

    transform(derivable: Derivable<T> | DerivableProxy<T>): T | undefined {
        if (this.current && this.current.derivable !== derivable) {
            this.ngOnDestroy();
        }

        if (!this.current) {
            if (isDerivable(derivable)) {
                this.current = new DerivableWrapper(derivable, this.changeDetector);
            } else if (isDerivableProxy(derivable)) {
                this.current = new DerivableProxyWrapper(derivable, this.changeDetector);
            } else {
                return derivable;
            }
        }

        return this.current.value();
    }

    ngOnDestroy(): void {
        if (this.current) {
            this.current.unsubscribe();
            this.current = null;
        }
    }
}

export interface DerivableProxy<T> {
    $react: Derivable<T>['react'];
    $value: T | undefined;
}

function isDerivableProxy<T>(obj: Derivable<T> | DerivableProxy<T>): obj is DerivableProxy<T> {
    return obj && typeof (obj as DerivableProxy<T>).$react === 'function';
}
