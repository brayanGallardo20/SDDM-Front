import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhDetalleComponent } from './gh-detalle.component';

describe('GhDetalleComponent', () => {
  let component: GhDetalleComponent;
  let fixture: ComponentFixture<GhDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
