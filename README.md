# Ngx Sherlock

[![Greenkeeper badge](https://badges.greenkeeper.io/politie/ngx-sherlock.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/politie/ngx-sherlock/badge.svg?branch=master)](https://coveralls.io/github/politie/sherlock?branch=master)

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
class AutoChangeDetectorService {
    init(): Promise<void>;
}
```

The `AutoChangeDetectorService` enables automatic change detection when using Sherlock Derivables, even when using the OnPush change-detection-strategy. The alternative is to use the `value`-pipe which is explained below. When using the `AutoChangeDetectorService` it is no longer needed to use the pipe.

The service needs to be instantiated once for each component. This is accomplished by mentioning it in the `providers` section of the Component metadata. It will detach the default ChangeDetector and re-enables change detection once `#init()` is called. This will ensure that change detection is wrapped with Sherlock magic.

The `AutoChangeDetectorService` service guarantees model and view fidelity, meaning one can easily use Angular's forms and template functionality.

#### Example

`trusty-sidekick.component.ts`:
```typescript
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { AutoChangeDetectorService } from '@politie/ngx-sherlock';
import { atom, Derivable } from '@politie/sherlock';

@Component({
    selector: 'trusty-sidekick',
    template: `
        <input type="text" [(ngModel)]="firstname$.value" placeholder="First name">
        <input type="text" [(ngModel)]="surname$.value" placeholder="Surname">
        <sidekick-greeter [name]="sidekick$"></sidekick-greeter>
    `,
    providers: [AutoChangeDetectorService],
})
export class TrustySidekickComponent {
    readonly sidekick$ = atom({ firstname: 'John', surname: 'Watson' });
    readonly firstname$ = this.sidekick$.pluck('firstname');
    readonly surname$ = this.sidekick$.pluck('surname');

    // Here we call AutoChangeDetectorService#init which will automatically react on changes in the state of
    // any used derivable.
    constructor(autoCD: AutoChangeDetectorService) { autoCD.init(); }
}

@Component({
    selector: 'sidekick-greeter',
    template: `
        <h2 *ngIf="!beObnoxious">Well hello there, {{ name.value.firstname }} {{ name.value.surname }}!</h2>
        <h2 *ngIf="beObnoxious">So good of you to finally join us, {{ name.value.surname }}...</h2>
        
        <button (click)="toggle()">Change mood</button>     
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AutoChangeDetectorService],
})
export class SidekickGreeterComponent implements OnInit {
    @Input() name: Derivable<{ firstname: string, surname: string }>;
    obnoxious$ = atom(false);

    get beObnoxious() {
        return this.obnoxious$.get();
    }

    constructor(autoCD: AutoChangeDetectorService) { autoCD.init(); }

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
<p>We're already at: <strong>{{ counter$ | value }}</strong></p>
```

`my.component.ts`:
```typescript
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { atom } from '@politie/sherlock';

@Component({
    selector: 'my-component';
    templateUrl: 'my.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent implements OnInit {
    readonly counter$ = atom(0);

    ngOnInit() {
        setInterval(() => this.counter$.swap(i => i++), 1000);
    }
}
```
