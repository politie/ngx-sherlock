import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoChangeDetectorService } from '@politie/ngx-sherlock';
import { ClockService } from '../clock.service';

@Component({
    selector: 'app-auto-change-detection-service',
    templateUrl: './auto-change-detection-service.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AutoChangeDetectorService],
    standalone: false
})
export class AutoChangeDetectionServiceComponent {

    constructor(
        acd: AutoChangeDetectorService,
        readonly clock: ClockService,
    ) {
        acd.init();
    }
}
