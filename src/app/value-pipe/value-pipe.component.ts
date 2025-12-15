import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValuePipe } from '@politie/ngx-sherlock';
import { ClockService } from '../clock.service';

@Component({
    selector: 'app-value-pipe',
    templateUrl: './value-pipe.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ValuePipe],
})
export class ValuePipeComponent {
    constructor(readonly clock: ClockService) { }
}
