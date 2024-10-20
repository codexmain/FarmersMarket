import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProDetallePage } from './pro-detalle.page';

describe('ProDetallePage', () => {
  let component: ProDetallePage;
  let fixture: ComponentFixture<ProDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
