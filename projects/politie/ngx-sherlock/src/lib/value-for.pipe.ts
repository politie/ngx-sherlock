import {
    ChangeDetectorRef,
    OnDestroy,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { Derivable, isDerivable, unresolved } from '@politie/sherlock';
import { DerivableProxy, isDerivableProxy } from '@politie/sherlock-proxy';

/**
 * The {@link ValueForPipe} is designed to be used inside Angular's
 * `@for` loops. It keeps a `Derivable` or `DerivableProxy` in sync with
 * Angular's change detection without unwrapping the value directly.
 *
 * Unlike {@link ValuePipe}, this pipe **returns the derivable object itself**,
 * so you can decide in the template how to extract the value (`.get()` or `$value`).
 *
 * Whenever the derivable updates, the `ChangeDetectorRef` of the `@Host()` component
 * will be `markForCheck` to ensure the loop items re-render correctly.
 *
 * ## Example usage
 *
 * ```html
 * <!-- Example with Derivable in a for loop -->
 * @for (item of items$ | valueFor; track item) {
 *   <li>{{ item.get() }}</li>
 * }
 *
 * <!-- Example with DerivableProxy -->
 * @for (user of users$ | valueFor; track user) {
 *   <li>{{ user.$value?.name }}</li>
 * }
 * ```
 */
@Pipe({
    name: 'valueFor', pure: false,
    standalone: false
})
export class ValueForPipe<T> implements PipeTransform, OnDestroy {
    #current?: Derivable<T> | DerivableProxy<T>;
    #unsubscribe?: () => void;

    constructor(private readonly cdr: ChangeDetectorRef) {}

    transform<D extends Derivable<T> | DerivableProxy<T>>(
        derivable: D
    ): D | undefined {
        if (this.#current && this.#current !== derivable) {
            this.ngOnDestroy();
        }

        if (!this.#current) {
            this.#subscribe(derivable);
            this.#current = derivable;
        }

        if (
            isDerivable(this.#current) &&
            this.#current.getState() === unresolved
        ) {
            return undefined;
        }

        return this.#current as D;
    }

    ngOnDestroy(): void {
        this.#unsubscribe?.();
        this.#unsubscribe = undefined;
        this.#current = undefined;
    }

    #subscribe(derivable: Derivable<T> | DerivableProxy<T>) {
        if (isDerivable(derivable)) {
            this.#unsubscribe = derivable.react(() => this.cdr.markForCheck());
        } else if (isDerivableProxy(derivable)) {
            this.#unsubscribe = derivable.$react(() => this.cdr.markForCheck());
        }
    }
}
