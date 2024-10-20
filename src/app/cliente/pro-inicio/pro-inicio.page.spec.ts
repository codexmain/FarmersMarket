import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProInicioPage } from './pro-inicio.page';

describe('ProInicioPage', () => {
  let component: ProInicioPage;
  let fixture: ComponentFixture<ProInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
