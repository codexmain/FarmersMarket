import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewItemPage } from './view-item.page';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { of } from 'rxjs';

// Mock para ModalController
class MockModalController {
  dismiss = jasmine.createSpy('dismiss');
}

// Mock para NavParams
class MockNavParams {
  get(param: string) {
    return {
      proveedor_id: 1,
      nombre_producto: 'Producto Test',
      descripcion_producto: 'Descripción Test',
      precio: 100,
      stock: 10,
      organico: true,
      categoria_id: 2,
      subcategoria_id: 3,
      photo: 'ruta/foto.jpg',
      estado_producto: 'activo',
    };
  }
}

// Mock para DataBaseService
class MockDataBaseService {
  dbState() {
    return of(true);
  }
  fetchCmbProveedores() {
    return of([{ id: 1, nombre_empresa: 'Proveedor Test' }]);
  }
  fetchCategorias() {
    return of([{ id: 2, nombre: 'Categoría Test' }]);
  }
  fetchCmbSubCategorias() {
    return of([{ id: 3, nombre: 'Subcategoría Test' }]);
  }
}

describe('ViewItemPage', () => {
  let component: ViewItemPage;
  let fixture: ComponentFixture<ViewItemPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewItemPage],
      imports: [IonicModule.forRoot(), FormsModule, ReactiveFormsModule],
      providers: [
        { provide: ModalController, useClass: MockModalController },
        { provide: NavParams, useClass: MockNavParams },
        { provide: DataBaseService, useClass: MockDataBaseService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permitir propiedades desconocidas como routerLink
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load producto details from NavParams', () => {
    expect(component.proveedor_id).toBe(1);
    expect(component.nombre_producto).toBe('Producto Test');
    expect(component.descripcion_producto).toBe('Descripción Test');
    expect(component.precio).toBe(100);
    expect(component.stock).toBe(10);
    expect(component.organico).toBe(true);
    expect(component.categoria_id).toBe(2);
    expect(component.subcategoria_id).toBe(3);
    expect(component.photo).toBe('ruta/foto.jpg');
    expect(component.estado_producto).toBe('activo');
  });

  it('should fetch data for comboboxes', () => {
    expect(component.arrayCmbProvedores).toEqual([{ id: 1, nombre_empresa: 'Proveedor Test' }]);
    expect(component.arrayCmbCategorias).toEqual([{ id: 2, nombre: 'Categoría Test' }]);
    expect(component.arrayCmbSubcategorias).toEqual([{ id: 3, nombre: 'Subcategoría Test' }]);
  });

  it('should dismiss modal', () => {
    component.dismiss();
    expect(component['modalController'].dismiss).toHaveBeenCalled();
  });
});
