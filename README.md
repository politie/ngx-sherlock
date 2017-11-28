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

`trusty-sidekick.component.ts`:
```typescript
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { autoDetectChanges } from '@politie/ngx-sherlock';
import { atom } from '@politie/sherlock';
import { ProxyDescriptor } from '@politie/sherlock-proxy';

@Component({
    selector: 'trusty-sidekick',
    template: `
        <input type="text" [(ngModel)]="sidekick$.firstname.$value" placeholder="First name">
        <input type="text" [(ngModel)]="sidekick$.surname.$value" placeholder="Surname">
        <sidekick-greeter [name]="sidekick$"></sidekick-greeter>
    `,
})
export class TrustySidekickComponent {

    private readonly sidekickAtom$ = atom({ firstname: 'John', surname: 'Watson' });
    readonly sidekick$ = new ProxyDescriptor().$create(this.sidekick$);
}

@Component({
    selector: 'sidekick-greeter',
    template: `
        <h2 *ngIf="!beObnoxious">Well hello there, {{name.firstname.$value}} {{name.surname.$value}}!</h2>
        <h2 *ngIf="beObnoxious">So good of you to finally join us, {{name.surname.$value}}...</h2>
        
        <button (click)="toggle()">Change mood</button>     
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidekickGreeterComponent implements OnInit {
    @Input() name: DerivableProxy<{ firstname: string, surname: string }>;
    obnoxious$ = atom(false);

    get beObnoxious() {
        return this.obnoxious$.get();
    }

    constructor(private readonly cdr: ChangeDetectorRef) { }

    ngOnInit() {
        // Here we call #autoDetectChanges which will automatically react on changes in the state of
        // SidekickGreeterComponent#name.
        autoDetectChanges(this.cdr);
    }

    toggle() {
        this.obnoxious$.swap(mood => !mood);
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent implements OnInit {
    readonly counter$: Atom<number> = atom(0);

    ngOnInit() {
        setInterval(() => this.counter$.swap(i => i++), 1000);
    }
}
```