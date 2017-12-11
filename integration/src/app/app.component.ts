import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { atom, isDerivable } from '@politie/sherlock';
import { autoDetectChanges, ValuePipe } from '@politie/ngx-sherlock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title$ = atom('my title');

  number$ = atom(0);

  get number() {
    return this.number$.get();
  }

  constructor(public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    autoDetectChanges(this.cdr);
  }

  changeTitle(title: string) {
    this.title$.set(title);
  }

  changeNumber(number: number) {
    this.number$.set(number);
  }
}
