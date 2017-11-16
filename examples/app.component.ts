import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Atom, atom, Derivable, derivation } from '@politie/sherlock';
import { List, Map } from 'immutable';
import { bohemia } from './text/bohemia';
import { redHeadedLeague } from './text/red-headed-league';
import { UtilsService } from './utils.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

    constructor(private utils: UtilsService) { }

    private readonly books = { bohemia, redHeadedLeague };

    /**
     * Atoms are the basic building blocks of this reactive application. They are mutable references to immutable values.
     * Atoms represent the ground truth from which the total application state is derived.
     */
    private readonly currentBook$: Atom<List<string>> = atom(this.books.bohemia);
    readonly currentFontSize$: Atom<number> = atom(this.utils.getAvailableSizes()[0]);
    readonly currentPageNumber$: Atom<number> = atom(0);

    /**
     * Derivations are calculated derived state based on Atoms or other Derivations. They can be created by calling #derive
     * on an Atom or other derivation, or can be made with the `derivation()` function. The latter automatically registers
     * which derivable is dependent on which and updates derived state when any derivable in the state complex changes.
     */
    private readonly currentBookPaginated$ = derivation(
        () => this.utils.getPaginatedBook(this.currentFontSize$.get(), this.currentBook$.get()),
    );

    readonly currentPage$: Derivable<List<string>> = this.currentBookPaginated$.derive(list => {
        return list.get(this.currentPageNumber$.get());
    });

    readonly currentTotalPages$ = this.currentBookPaginated$.derive(book => book.count());

    get bookNames() {
        return Object.keys(this.books);
    }

    get availableSizes() {
        return this.utils.getAvailableSizes();
    }

    setBook(bookName: string) {
        this.currentBook$.set(this.books[bookName]);
    }

    setFontSize(size: number) {
        this.currentFontSize$.set(size);
    }

    setPageNumber(num: number) {
        this.currentPageNumber$.set(this.currentPageNumber$.get() + num);
    }
}
