import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivoCrudComponent } from './directivo-crud.component';

describe('DirectivoCrudComponent', () => {
  let component: DirectivoCrudComponent;
  let fixture: ComponentFixture<DirectivoCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectivoCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
