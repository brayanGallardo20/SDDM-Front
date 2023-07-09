import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivoListComponent } from './directivo-list.component';

describe('DirectivoListComponent', () => {
  let component: DirectivoListComponent;
  let fixture: ComponentFixture<DirectivoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectivoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
