import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingDetailsComponent } from './wedding-details.component';

describe('WeddingDetailsComponent', () => {
  let component: WeddingDetailsComponent;
  let fixture: ComponentFixture<WeddingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
