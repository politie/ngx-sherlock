import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { atom } from '@politie/sherlock';
import { autoDetectChanges } from '@politie/ngx-sherlock';

@Component({
    selector: 'app-auto-detected',
    templateUrl: './auto-detected.component.html',
    styleUrls: ['./auto-detected.component.scss']
})
export class AutoDetectedComponent implements OnInit {

    state$ = atom<number>(0);
    derivedTitle$ = this.state$.derive(num => `Our number is ${num}`);

    constructor(private readonly cdr: ChangeDetectorRef) { }

    ngOnInit() {
        autoDetectChanges(this.cdr);
    }

    setNumber(num: number) {
        this.state$.swap(prev => prev + num);
    }

}
