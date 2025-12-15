import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoChangeDetectionServiceComponent } from './auto-change-detection-service/auto-change-detection-service.component';
import { ValuePipeComponent } from './value-pipe/value-pipe.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AutoChangeDetectionServiceComponent, ValuePipeComponent],
})
export class AppComponent { }
