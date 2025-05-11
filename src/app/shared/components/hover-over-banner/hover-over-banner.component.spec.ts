import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverOverBannerComponent } from './hover-over-banner.component';

describe('HoverOverBannerComponent', () => {
  let component: HoverOverBannerComponent;
  let fixture: ComponentFixture<HoverOverBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverOverBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoverOverBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
