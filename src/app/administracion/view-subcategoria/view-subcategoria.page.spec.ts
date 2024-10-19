import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSubcategoriaPage } from './view-subcategoria.page';

describe('ViewSubcategoriaPage', () => {
  let component: ViewSubcategoriaPage;
  let fixture: ComponentFixture<ViewSubcategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
