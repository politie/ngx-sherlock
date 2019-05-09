import { QueryList } from '@angular/core';
import { atom, Derivable, unwrap } from '@politie/sherlock';
import { fromObservable } from '@politie/sherlock-rxjs';
import { map } from 'rxjs/operators';

export function derivableQueryList<T>(query: () => QueryList<T>): LazyDerivable<T[]> {
    const query$ = atom.unresolved<QueryList<T>>();
    const d$ = query$
        .map((q) => fromObservable(q.changes.pipe(map(() => q.toArray())))
            .fallbackTo(() => q.toArray()))
        .derive(unwrap);
    const lazy$ = d$ as LazyDerivable<T[]>;
    lazy$.markInitialized = () => query$.set(query());
    return lazy$;
}

export type LazyDerivable<T> = Derivable<T> & {
    /** invoke this once the QueryList is known (in ngAfterContentInit for ContentChildren or ngAfterViewInit for ViewChildren)  */
    markInitialized: () => void;
};
