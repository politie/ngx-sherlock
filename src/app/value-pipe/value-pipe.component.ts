import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClockService } from '../clock.service';

@Component({
    selector: 'app-value-pipe',
    templateUrl: './value-pipe.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ValuePipeComponent {
    constructor(readonly clock: ClockService) { }
}
