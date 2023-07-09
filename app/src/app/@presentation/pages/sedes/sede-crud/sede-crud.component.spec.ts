import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeCrudComponent } from './sede-crud.component';

describe('SedeCrudComponent', () => {
  let component: SedeCrudComponent;
  let fixture: ComponentFixture<SedeCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeCrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
