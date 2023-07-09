import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestrosArbitroComponent } from './maestros-arbitro.component';

describe('MaestrosArbitroComponent', () => {
  let component: MaestrosArbitroComponent;
  let fixture: ComponentFixture<MaestrosArbitroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaestrosArbitroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaestrosArbitroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
