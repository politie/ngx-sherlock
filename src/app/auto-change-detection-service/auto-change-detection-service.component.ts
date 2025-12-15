import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoChangeDetectorService } from '@politie/ngx-sherlock';
import { ClockService } from '../clock.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-auto-change-detection-service',
    templateUrl: './auto-change-detection-service.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AutoChangeDetectorService],
    imports: [FormsModule],
})
export class AutoChangeDetectionServiceComponent {

    constructor(
        acd: AutoChangeDetectorService,
        readonly clock: ClockService,
    ) {
        acd.init();
    }
}
