import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-navigator',
    templateUrl: './navigator.component.html',
    styleUrls: ['./navigator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent {
    @Input() availableSizes: number[];
    @Input() bookNames: string[];

    @Output() fontSizeChanged = new EventEmitter<number>();
    @Output() bookChanged = new EventEmitter<string>();
    @Output() pageNumberChanged = new EventEmitter<number>();

    setFontSize(size: number) {
        console.log(size);
        this.fontSizeChanged.emit(size);
    }

    setBook(name: string) {
        this.bookChanged.emit(name);
    }

    setPageNumber(number: number) {
        this.pageNumberChanged.emit(number);
    }
}
