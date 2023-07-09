import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionConfiguracionComponent } from './gestion-configuracion.component';

describe('GestionConfiguracionComponent', () => {
  let component: GestionConfiguracionComponent;
  let fixture: ComponentFixture<GestionConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionConfiguracionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
