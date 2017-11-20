import { OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Atom } from '@politie/sherlock';
import { DerivableProxy, isDerivableProxy } from '@politie/sherlock-proxy';

export abstract class AbstractValueAccessor<T, D = Atom<T> | DerivableProxy<T>> implements ControlValueAccessor, OnInit, OnDestroy {

    disabled: boolean;
    private source$: D;

    foo() {
        this.source$.
    }
}
