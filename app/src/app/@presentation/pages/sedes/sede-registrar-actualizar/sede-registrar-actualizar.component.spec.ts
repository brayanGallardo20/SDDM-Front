import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeRegistrarActualizarComponent } from './sede-registrar-actualizar.component';

describe('SedeRegistrarActualizarComponent', () => {
  let component: SedeRegistrarActualizarComponent;
  let fixture: ComponentFixture<SedeRegistrarActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeRegistrarActualizarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeRegistrarActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
