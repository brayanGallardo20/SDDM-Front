import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInstPubComponent } from './info-inst-pub.component';

describe('InfoInstPubComponent', () => {
  let component: InfoInstPubComponent;
  let fixture: ComponentFixture<InfoInstPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoInstPubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoInstPubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
