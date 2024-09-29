import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoriasPage } from './subcategorias.page';

describe('SubcategoriasPage', () => {
  let component: SubcategoriasPage;
  let fixture: ComponentFixture<SubcategoriasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
