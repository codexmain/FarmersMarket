import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarCategoriaPage } from './modificar-categoria.page';

describe('ModificarCategoriaPage', () => {
  let component: ModificarCategoriaPage;
  let fixture: ComponentFixture<ModificarCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
