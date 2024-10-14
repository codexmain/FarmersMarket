import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarSubcategoriaPage } from './modificar-subcategoria.page';

describe('ModificarSubcategoriaPage', () => {
  let component: ModificarSubcategoriaPage;
  let fixture: ComponentFixture<ModificarSubcategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
