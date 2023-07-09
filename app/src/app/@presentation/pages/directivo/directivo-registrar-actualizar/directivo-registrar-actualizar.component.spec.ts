import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivoRegistrarActualizarComponent } from './directivo-registrar-actualizar.component';

describe('DirectivoRegistrarActualizarComponent', () => {
  let component: DirectivoRegistrarActualizarComponent;
  let fixture: ComponentFixture<DirectivoRegistrarActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectivoRegistrarActualizarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivoRegistrarActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
