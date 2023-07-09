import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroTpoDocComponent } from './maestro-tpo-doc.component';

describe('MaestroTpoDocComponent', () => {
  let component: MaestroTpoDocComponent;
  let fixture: ComponentFixture<MaestroTpoDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestroTpoDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestroTpoDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
