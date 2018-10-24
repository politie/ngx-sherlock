import { Injectable, NgZone } from '@angular/core';
import { atom, PullDataSource, unwrap } from '@politie/sherlock';

class Clock extends PullDataSource<string> {
    constructor(readonly interval = 1000, private readonly zone: NgZone) { super(); }

    calculateCurrentValue() {
        if (this.connected) {
            // This way the updates are aligned with the actual time-periods that pass.
            const ms = this.interval - (Date.now() % this.interval);
            this.zone.runOutsideAngular(() => setTimeout(() => this.zone.run(() => this.checkForChanges()), ms));
        }
        return new Date().toLocaleTimeString();
    }
}

@Injectable({
    providedIn: 'root',
})
export class ClockService {
    constructor(private readonly zone: NgZone) { }

    /** A clock that ticks every second. */
    readonly baseClock$ = new Clock(1000, this.zone);

    /** An interval that can be set through the UI. */
    readonly interval$ = atom(5000);

    /** The number of seconds, writable. */
    readonly seconds$ = this.interval$.map(ms => ms / 1000, s => s * 1000);

    /** A clock that ticks every seconds$.value seconds. */
    readonly intervalClock$ = this.interval$
        .derive(interval => new Clock(interval, this.zone))
        .derive(unwrap);
}
