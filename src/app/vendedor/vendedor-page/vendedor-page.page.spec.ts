import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendedorPagePage } from './vendedor-page.page';

describe('VendedorPagePage', () => {
  let component: VendedorPagePage;
  let fixture: ComponentFixture<VendedorPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
