import { Injectable } from '@angular/core';
import { List, Range } from 'immutable';

@Injectable()
export class UtilsService {

    private readonly sizeMap = [
        { size: 14, lines: 24 },
        { size: 18, lines: 22 },
        { size: 24, lines: 18 },
        { size: 36, lines: 14 },
        { size: 48, lines: 8 },
        { size: 72, lines: 2 }
    ];

    getAvailableSizes() {
        return this.sizeMap.map(val => val.size);
    }

    /**
     * Will return a list of a list of strings where the child lists contain one page.
     */
    getPaginatedBook(fontSize: number, book: List<string>): List<List<string>> {
        const chunkSize = this.getLinesForSize(fontSize);
        return Range(0, book.count(), chunkSize)
            .map(chunkStart => book.slice(chunkStart, chunkStart + chunkSize).toList())
            .toList();
    }

    // Ideally some method that calculates the amount of lines possibly shown
    // by taking the available screen real estate and dividing that by the line
    // height.
    getLinesForSize(fontSize: number | string): number {
        if (isString(fontSize)) {
            fontSize = parseInt(fontSize, 10);
        }
        return this.sizeMap.find(val => val.size === fontSize).lines;
    }
}

function isString(val: any): val is string {
    return val.charCodeAt !== undefined;
}
