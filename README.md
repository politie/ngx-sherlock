# Ngx Sherlock

[![Greenkeeper badge](https://badges.greenkeeper.io/politie/ngx-sherlock.svg)](https://greenkeeper.io/)

**NgxSherlock** is a set of Angular bindings for the [Sherlock](https://github.com/politie/sherlock)
 reactive state management library.

## Usage

### Installation

Install **NgxSherlock** by running:

```bash
$ npm install @politie/ngx-sherlock
```

Add the `NgxSherlockModule` to your `AppModule`:

```typescript
import { NgModule } from '@angular/core';
import { NgxSherlockModule } from '@politie/ngx-sherlock';

@NgModule({
    imports: [NgxSherlockModule],
    ...
})
export class AppModule { }
```

### `autoDetectChanges`

**Signature**:
```typescript
autoDetectChanges(detectorRef: ChangeDetectorRef): void;
```

The function `autoDetectChanges` will automatically run a change detection cycle when `Derivables` or `DerivableProxies` within a component's template change internal state. The function should be called in an `OnInit` lifecycle hook of a component or directive.

The `autoDetectChanges` function guarantees model and view fidelity, meaning one can easily use Angular's forms and template functionality.

#### Example

`trusty-sidekick.component.html`:
```html
<h2>Well there you are, {{sidekick$.firstname.$value}} {{sidekick$.surname.$value}}!</h2>
<input type="text" [(ngModel)]="sidekick$.firstname.$value" placeholder="First name">
<input type="text" [(ngModel)]="sidekick$.surname.$value" placeholder="Surname">
```

`trusty-sidekick.component.ts`:
```typescript
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { autoDetectChanges } from '@politie/ngx-sherlock';
import { atom } from '@politie/sherlock';
import { ProxyDescriptor } from '@politie/sherlock-proxy';

@Component({
    selector: 'trusty-sidekick',
    templateUrl: 'trusty-sidekick.component.html',
    changeDetection: ChangeDetectionStrategy.onPush,
})
export class TrustySidekickComponent implements OnInit {

    private readonly sidekickAtom$ = atom({ firstname: 'John', surname: 'Watson' });
    readonly sidekick$ = new ProxyDescriptor().$create(this.sidekick$);

    constructor(private readonly cdr: ChangeDetectorRef) { }

    ngOnInit() {
        // Calling autoDetectChanges here will keep the template up-to-date with the state.
        autoDetectChanges(this.cdr);
    }
}
```

---

### `ValuePipe`

The `ValuePipe` unwraps a `Derivable` or `DerivableProxy` value and triggers the `ChangeDetectorRef` whenever an internal value changes
and a change detection cycle is needed. This allows a component to have an `OnPush` `ChangeDetectionStrategy`, greatly increasing
performance.

#### Example

`my.component.html`:
```html
<h1>My awesome counter</h1>
<p>We're already at: <strong>{{counter$ | value}}</strong></p>
```

`my.component.ts`:
```typescript
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Atom, atom } from '@politie/sherlock';

@Component({
    selector: 'my-component';
    templateUrl: 'my.component.html',
    changeDetection: ChangeDetectionStrategy.onPush,
})
export class MyComponent implements OnInit {
    readonly counter$: Atom<number> = atom(0);

    ngOnInit() {
        setInterval(() => this.counter$.swap(i => i++), 1000);
    }
}
```