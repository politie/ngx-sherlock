import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoDetectedComponent } from './auto-detected.component';
import { MaterialSharedModule } from '../material-shared/material-shared.module';
import { By } from '@angular/platform-browser';

describe('AutoDetectedComponent', () => {
    let component: AutoDetectedComponent;
    let fixture: ComponentFixture<AutoDetectedComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AutoDetectedComponent],
            imports: [MaterialSharedModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AutoDetectedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should start out at zero', () => {
        expect(getTitleText(fixture)).toEqual('Our number is 0');
    });

    it('should properly set the text when state changes', () => {
        component.setNumber(100);
        expect(getTitleText(fixture)).toEqual('Our number is 100');

        component.setNumber(-42);
        expect(getTitleText(fixture)).toEqual('Our number is 58');
    });
});

function getTitleText(fixture: ComponentFixture<AutoDetectedComponent>) {
    return fixture.debugElement.query(By.css('#title')).nativeElement.innerText;
}
