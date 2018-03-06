import { ChangeDetectorRef } from '@angular/core';
import { derivation } from '@politie/sherlock';

/**
 * This function automatically detects changes when any `Derivable` or `DerivableProxy` in a consuming template changes state.
 * Tries to detect changes. When that fails due to a template error, will detach the `ChangeDetectorRef` and rethrow
 * said error.
 * @param detector `ChangeDetectorRef` instance passed in by a consuming component.
 */
export function autoDetectChanges(detector: ChangeDetectorRef) {
    if (!hasOnDestroy(detector)) {
        throw new Error(`autoDetectChanges was not called with a valid ChangeDetectorRef.`);
    }
    detector.onDestroy(derivation(() => {
        try {
            detector.detectChanges();
        } catch (error) {
            detector.detach();
            throw new Error(error);
        }
    }).react(() => void 0));
}

function hasOnDestroy(obj: any): obj is { onDestroy(cb: () => void); } {
    return obj && typeof obj.onDestroy === 'function';
}
