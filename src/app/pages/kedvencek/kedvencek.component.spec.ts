import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KedvencekComponent } from './kedvencek.component';

describe('KedvencekComponent', () => {
  let component: KedvencekComponent;
  let fixture: ComponentFixture<KedvencekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KedvencekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KedvencekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
