import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudInstPubMainComponent } from './crud-inst-pub-main.component';

describe('CrudInstPubMainComponent', () => {
  let component: CrudInstPubMainComponent;
  let fixture: ComponentFixture<CrudInstPubMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudInstPubMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudInstPubMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
