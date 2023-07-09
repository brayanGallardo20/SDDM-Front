import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroCodSgdComponent } from './maestro-cod-sgd.component';

describe('MaestroCodSgdComponent', () => {
  let component: MaestroCodSgdComponent;
  let fixture: ComponentFixture<MaestroCodSgdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroCodSgdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroCodSgdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
