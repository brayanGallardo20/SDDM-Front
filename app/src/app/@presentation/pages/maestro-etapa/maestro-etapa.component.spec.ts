import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroEtapaComponent } from './maestro-etapa.component';

describe('MaestroSubEtapaComponent', () => {
  let component: MaestroEtapaComponent;
  let fixture: ComponentFixture<MaestroEtapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroEtapaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
