import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxSherlockModule } from '@politie/ngx-sherlock';
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let cdrSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxSherlockModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    cdrSpy = spyOn(component.cdr, 'detectChanges').and.callThrough();
    fixture.detectChanges();
  });

  describe('ValuePipe', () => {
    it('should correctly render the title', () => {
      expect(getH1Text(fixture, '#valuepipe')).toEqual('my title');
    });

    it('should update title when button is pressed', () => {
      const button = fixture.debugElement.query(By.css('#change-title'));
      button.triggerEventHandler('click', null);
      expect(getH1Text(fixture, '#valuepipe')).toEqual('new title');
    });
  });

  describe('autoDetectChanges', () => {
    describe('changing the atom value', () => {
      it('should call ChangeDetectorRef#detectChanges', () => {
        expect(cdrSpy).toHaveBeenCalledTimes(1);

        component.changeNumber(5);
        expect(cdrSpy).toHaveBeenCalledTimes(2);

        component.changeNumber(10);
        expect(cdrSpy).toHaveBeenCalledTimes(3);

        expect(getH1Text(fixture, '#autodetect')).toEqual('10');
      });
    });
  });
});

function getH1Text(fixture: ComponentFixture<AppComponent>, id: string) {
  return fixture.debugElement.query(By.css(id)).nativeElement.textContent.trim();
}
