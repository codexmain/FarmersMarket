import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HacerAmonestacionPage } from './hacer-amonestacion.page';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { AmonestacionesssService } from '../../services/amonestacionesss.service';
import { DataBaseService } from '../../services/data-base.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

class MockModalController {
  dismiss(data?: any) {
    return Promise.resolve(data);
  }
}

class MockNavParams {
  get(param: string) {
    return { id: 1, email: 'test@example.com' }; // Devuelve un objeto simulado
  }
}

class MockAmonestacionesssService {
  enviarAmonestacion(email: string, descripcion: string, id_producto: number) {
    return of({ success: true }); // Simula una respuesta exitosa
  }
}

class MockDataBaseService {
  seleccionarCmbProdaAmonestar(usuarioId: number) {
    return Promise.resolve();
  }

  fetchCmbProdAmnstones() {
    return of([
      { id: 1, nombre: 'Producto 1' },
      { id: 2, nombre: 'Producto 2' },
    ]); // Simula una lista de productos
  }

  insertarAmonestacion(usuarioId: number, productoId: number, descripcion: string) {
    return Promise.resolve();
  }
}

describe('HacerAmonestacionPage', () => {
  let component: HacerAmonestacionPage;
  let fixture: ComponentFixture<HacerAmonestacionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HacerAmonestacionPage],
      imports: [FormsModule], // Agrega FormsModule para habilitar ngModel
      providers: [
        { provide: ModalController, useClass: MockModalController },
        { provide: NavParams, useClass: MockNavParams },
        { provide: AmonestacionesssService, useClass: MockAmonestacionesssService },
        { provide: DataBaseService, useClass: MockDataBaseService },
        AlertController,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignorar componentes personalizados de Ionic
    }).compileComponents();

    fixture = TestBed.createComponent(HacerAmonestacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate fields correctly', async () => {
    component.descripcion = 'A valid description for testing';
    const result = await component.validateFields();
    expect(result).toBeTrue();
  });

  it('should fail validation for empty description', async () => {
    component.descripcion = '';
    const result = await component.validateFields();
    expect(result).toBeUndefined(); // Falla y no retorna true
  });

  it('should call hacerAmonestacion with valid data', async () => {
    spyOn(component['amonestacionesssService'], 'enviarAmonestacion').and.callThrough();
    component.descripcion = 'Valid description';
    component.id_producto = 1;
    await component.hacerAmonestacion();
    expect(component['amonestacionesssService'].enviarAmonestacion).toHaveBeenCalledWith(
      'test@example.com',
      'Valid description',
      1
    );
  });

  it('should dismiss the modal', async () => {
    spyOn(component['modalController'], 'dismiss').and.callThrough();
    await component.dismiss();
    expect(component['modalController'].dismiss).toHaveBeenCalled();
  });
});
