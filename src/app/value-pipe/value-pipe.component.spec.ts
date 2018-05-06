import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSherlockModule } from '@politie/ngx-sherlock';
import { ValuePipeComponent } from './value-pipe.component';
import { MaterialSharedModule } from '../material-shared/material-shared.module';
import { By } from '@angular/platform-browser';

describe('ValuePipeComponent', () => {
    let component: ValuePipeComponent;
    let fixture: ComponentFixture<ValuePipeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValuePipeComponent],
            imports: [NgxSherlockModule, MaterialSharedModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValuePipeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should start out at zero', () => {
        expect(getTitleText(fixture)).toEqual('Our number is 0');
    });

    it('should properly set the text when state changes', () => {
        component.setNumber(100);
        fixture.detectChanges();
        expect(getTitleText(fixture)).toEqual('Our number is 100');

        component.setNumber(-42);
        fixture.detectChanges();
        expect(getTitleText(fixture)).toEqual('Our number is 58');
    });
});

function getTitleText(fixture: ComponentFixture<ValuePipeComponent>) {
    return fixture.debugElement.query(By.css('#title')).nativeElement.innerText;
}
