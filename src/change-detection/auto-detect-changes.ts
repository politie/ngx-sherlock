import { ChangeDetectorRef } from '@angular/core';
import { derivation } from '@politie/sherlock';

export function autoDetectChanges(detector: ChangeDetectorRef) {
    if (!hasOnDestroy(detector)) {
        throw new Error(`autoDetectChanges was not called with a valid ChangeDetectorRef.`);
    }
    detector.onDestroy(derivation(() => detector.detectChanges()).react(() => void 0));
}

function hasOnDestroy(obj: any): obj is { onDestroy(cb: () => void); } {
    return obj && obj.onDestroy === 'function';
}
