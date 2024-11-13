import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HacerAmonestacionPage } from './hacer-amonestacion.page';

describe('HacerAmonestacionPage', () => {
  let component: HacerAmonestacionPage;
  let fixture: ComponentFixture<HacerAmonestacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HacerAmonestacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
