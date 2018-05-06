import { Component } from '@angular/core';
import { atom } from '@politie/sherlock';

@Component({
    selector: 'app-value-pipe',
    templateUrl: './value-pipe.component.html',
    styleUrls: ['./value-pipe.component.scss']
})
export class ValuePipeComponent {

    state$ = atom<number>(0);
    derivedTitle$ = this.state$.derive(num => `Our number is ${num}`);

    setNumber(num: number) {
        this.state$.swap(prev => prev + num);
    }

}
