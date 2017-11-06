import { Component } from '@angular/core';
import { atom } from '@politie/sherlock';

@Component({
    selector: 'example-root',
    templateUrl: './example.component.html',
    styleUrls: [],
})
export class ExampleComponent {
    title$ = atom('foo');

    changeTitle() {
        this.title$.swap(t => t + t);
    }
}
