import { _internal, Derivable } from '@politie/sherlock';

const { symbols } = _internal;

export function getObservers(d$: Derivable<any>): _internal.Observer[] {
    return (d$ as any as _internal.TrackedObservable)[symbols.observers];
}
