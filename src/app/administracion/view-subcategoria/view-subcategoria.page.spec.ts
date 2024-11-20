import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSubcategoriaPage } from './view-subcategoria.page';
import { ModalController, IonicModule, NavController, NavParams } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { of } from 'rxjs';

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para NativeStorage
class MockNativeStorage {
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData');
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve();
  }
}

// Mock para NavParams
class MockNavParams {
  get(param: string) {
    return {
      nombre: 'Subcategoría Test',
      categoria_id: 1,
      estado_subcategoria: 'activa',
    };
  }
}

// Mock para ModalController
class MockModalController {
  dismiss = jasmine.createSpy('dismiss'); // Simula el método dismiss
}

describe('ViewSubcategoriaPage', () => {
  let component: ViewSubcategoriaPage;
  let fixture: ComponentFixture<ViewSubcategoriaPage>;
  let modalController: MockModalController;

  beforeEach(async () => {
    modalController = new MockModalController();

    await TestBed.configureTestingModule({
      declarations: [ViewSubcategoriaPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: ModalController, useValue: modalController },
        { provide: SQLite, useClass: MockSQLite },
        { provide: NativeStorage, useClass: MockNativeStorage },
        { provide: NavParams, useClass: MockNavParams },
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize subcategory data', () => {
    expect(component.nombre).toBe('Subcategoría Test');
    expect(component.categoria_id).toBe(1);
    expect(component.estado_subcategoria).toBe('activa');
  });

  it('should dismiss the modal', async () => {
    await component.dismiss();
    expect(modalController.dismiss).toHaveBeenCalled();
  });
});
