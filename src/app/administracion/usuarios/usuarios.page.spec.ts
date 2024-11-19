import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosPage } from './usuarios.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { OlvideContraService } from 'src/app/services/olvide-contra.service'; // Ruta correcta
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

class MockNativeStorage {
  getItem() {
    return Promise.resolve({});
  }
  setItem() {
    return Promise.resolve({});
  }
}

class MockModalController {
  create() {
    return Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(),
    });
  }
}

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración moderna para HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock para ActivatedRoute con un parámetro simulado
        },
        DataBaseService, // Proveedor para DataBaseService
        OlvideContraService, // Proveedor para OlvideContraService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});