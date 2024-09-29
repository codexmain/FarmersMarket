import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSubcategoriaPage } from './add-subcategoria.page';

describe('AddSubcategoriaPage', () => {
  let component: AddSubcategoriaPage;
  let fixture: ComponentFixture<AddSubcategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
