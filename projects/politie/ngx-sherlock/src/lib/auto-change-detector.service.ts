import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { _internal } from '@politie/sherlock';

/** @internal */
export const { symbols } = _internal;

/**
 * This service wraps the ChangeDetector to automatically detect changes when the state of any used Derivable or DerivableProxy changes.
 *
 * Can be used with DI by providing it explicitly in every component that uses it, as follows:
 *
 * ```typescript
 * @Component({
 *   selector: 'my-component',
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 *   providers: [AutoChangeDetectorService], // <-- this is important
 * })
 * export class AutoChangeDetectionServiceComponent {
 *   constructor(acd: AutoChangeDetectorService) {
 *     acd.init();
 *   }
 * }
 * ```
 *
 * Or as follows:
 * ```typescript
 * @Component({
 *   selector: 'my-component',
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 * export class AutoChangeDetectionServiceComponent {
 *   constructor(cd: ChangeDetectorRef) {
 *     new AutoChangeDetectorService(cd).init();
 *   }
 * }
 * ```
 */
@Injectable()
export class AutoChangeDetectorService implements OnDestroy {

    constructor(private readonly detector: ChangeDetectorRef) {
        if (!hasOnDestroy(this.detector)) {
            // Incompatible Angular version?
            throw new Error(
                `The method 'onDestroy' was not found on the provided ChangeDetectorRef. ` +
                `AutoChangeDetectorService will not work correctly.`
            );
        }
        this.detector.detach();
    }

    /** @internal */
    readonly id = -1;
    /** @internal */
    readonly [symbols.dependencies]: _internal.TrackedObservable[] = [];
    /** @internal */
    readonly [symbols.dependencyVersions]: Record<number, number> = {};

    private marked = false;

    /** @internal */
    [symbols.disconnect]() {
        for (const dep of this[symbols.dependencies]) {
            _internal.removeObserver(dep, this);
        }
        this[symbols.dependencies].length = 0;
    }

    /** @internal */
    [symbols.mark]() {
        if (this.marked) { return; }
        this.marked = true;
        setTimeout(() => {
            this.marked = false;
            this.hasChange() && this.detectChangesNow();
        }, 0);
    }

    async init() {
        await Promise.resolve();
        return this.detectChangesNow();
    }

    detectChangesNow() {
        _internal.startRecordingObservations(this);
        try {
            this.detector.reattach();
            this.detector.detectChanges();
        } finally {
            _internal.stopRecordingObservations();
        }
    }

    ngOnDestroy() {
        this[symbols.disconnect]();
    }

    private hasChange() {
        const deps = this[symbols.dependencies];
        const versions = this[symbols.dependencyVersions];
        return deps.some((obs) => versions[obs.id] !== obs.version);
    }
}

function hasOnDestroy(obj: any): obj is { onDestroy(cb: () => void): void } {
    return obj && typeof obj.onDestroy === 'function';
}
