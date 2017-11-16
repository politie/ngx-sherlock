import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { List } from 'immutable';

@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    styleUrls: ['./viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {

    @Input() page: List<string>;
    @Input() size: number;
    private _pageNumber: number;
    @Input() set pageNumber(val: number) {
        this._pageNumber = val;
    }
    get pageNumber() {
        return this._pageNumber + 1;
    }
    private _totalPages: number;
    @Input() set totalPages(val: number) {
        this._totalPages = val;
    }
    get totalPages() {
        return this._totalPages + 1;
    }

}
