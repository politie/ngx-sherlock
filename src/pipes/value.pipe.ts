import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, WrappedValue } from '@angular/core';
import { Derivable, isDerivable } from '@politie/sherlock';
import { DerivableProxy, isDerivableProxy } from '../types/proxy';
import { InvalidPipeArgumentError } from './InvalidPipeArgumentError';

/**
 * @internal
 * Base reaction strategy.
 */
export interface ReactionStrategy {
    /** set up a reaction */
    createReaction<T>(async: Derivable<T> | DerivableProxy<T>, updateLatestValue: (value: T) => void): void;
    /** dispose internal reaction */
    dispose(): void;
}

/**
 * @internal
 * Reaction strategy for Derivable values.
 */
export class DerivableStrategy implements ReactionStrategy {
    /**
     * Disposes the internal reaction reference.
     */
    dispose: () => void;
    /**
     * Sets up the reaction.
     *
     * @param async provided derivable
     * @param updateLatestValue function to run whenever a new value is emitted
     */
    createReaction<T>(async: Derivable<T>, updateLatestValue: (value: T) => void) {
        this.dispose = async.react(updateLatestValue);
    }
}

/**
 * @internal
 * Reaction strategy for DerivableProxy values.
 */
export class DerivableProxyStrategy implements ReactionStrategy {
    /**
     * Disposes the internal reaction reference.
     */
    dispose: () => void;
    /**
     * Sets up the reaction.
     *
     * @param async provided derivableProxy
     * @param updateLatestValue function to run whenever a new value is emitted
     */
    createReaction<T>(async: DerivableProxy<T>, updateLatestValue: (value: T) => void) {
        this.dispose = async.$react(updateLatestValue);
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
@Pipe({ name: 'value', pure: false })
export class ValuePipe implements PipeTransform, OnDestroy {

    /** cached latest value */
    protected latestValue: any = undefined;
    /** cached latest returned value */
    protected latestReturnedValue: any = undefined;
    /** cache to stored value obj */
    protected storedObj: any = undefined;
    /** chosen strategy for reaction */
    protected strategy: ReactionStrategy = undefined!;

    /**
     * The ValuePipe parses derivable values in ontology objects and returns the literal value. When a state update occurs, the change
     * detection is marked for check. It functions similarly to Angular's AsyncPipe and can be used in templates.
     * @param ref {ChangeDetectorRef} Angular change detection reference
     */
    constructor(protected ref: ChangeDetectorRef) { }

    /**
     * Called when `@Host()` component gets destroyed.
     */
    ngOnDestroy() {
        if (this.strategy) {
            this.dispose();
        }
    }

    transform<T>(obj: Derivable<T> | DerivableProxy<T>): WrappedValue | T {
        if (!this.storedObj) {
            if (obj) {
                this.subscribe(obj);
            }
            this.latestReturnedValue = this.latestValue;
            return this.latestValue;
        }

        if (obj !== this.storedObj) {
            this.dispose();
            return this.transform(obj);
        }

        if (this.latestValue === this.latestReturnedValue) {
            return this.latestReturnedValue;
        }

        this.latestReturnedValue = this.latestValue;
        return WrappedValue.wrap(this.latestValue);
    }

    protected subscribe<T>(obj: Derivable<T> | DerivableProxy<T>) {
        this.storedObj = obj;
        this.strategy = this.selectStrategy(obj);
        this.strategy.createReaction<T>(obj, (value: T) => this.updateLatestValue(value));
    }

    protected selectStrategy<T>(obj: Derivable<T> | DerivableProxy<T>) {
        if (isDerivableProxy(obj)) {
            return new DerivableProxyStrategy();
        } else if (isDerivable(obj)) {
            return new DerivableStrategy();
        } else {
            throw new InvalidPipeArgumentError(ValuePipe, obj);
        }
    }

    protected updateLatestValue<T>(value: T) {
        this.latestValue = value;
        this.ref.markForCheck();
    }

    private dispose() {
        this.strategy.dispose();
        this.latestValue = undefined;
        this.latestReturnedValue = undefined;
        this.storedObj = undefined;
        this.strategy = undefined!;
    }

}
