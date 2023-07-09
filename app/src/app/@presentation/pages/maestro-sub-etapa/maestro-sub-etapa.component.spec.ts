import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroSubEtapaComponent } from './maestro-sub-etapa.component';

describe('MaestroSubEtapaComponent', () => {
  let component: MaestroSubEtapaComponent;
  let fixture: ComponentFixture<MaestroSubEtapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroSubEtapaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroSubEtapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
