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

### `ValuePipe`

The `ValuePipe` unwraps a `Derivable` or `DerivableProxy` value and triggers the `ChangeDetectorRef` whenever an internal value changes and a change detection cycle is needed.

#### Example

`my.component.html`:
```html
<h1>My awesome counter</h1>
<p>We're already at: <strong>{{counter$ | value}}</strong></p>
```

`my.component.ts`:
```typescript
import { Component, OnInit } from '@angular/core';
import { Atom, atom } from '@politie/sherlock';

@Component({
    selector: 'my-component';
    templateUrl: 'my.component.html',
})
export class MyComponent implements OnInit {
    readonly counter$: Atom<number> = atom(0);

    ngOnInit() {
        setInterval(() => counter$.swap(i => i++), 1000);
    }
}
```