import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPagePage } from './admin-page.page';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { OlvideContraService } from 'src/app/services/olvide-contra.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  getItem() {
    return Promise.resolve({});
  }
  setItem() {
    return Promise.resolve({});
  }
}

describe('AdminPagePage', () => {
  let component: AdminPagePage;
  let fixture: ComponentFixture<AdminPagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPagePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock para ActivatedRoute
        },
        {
          provide: NativeStorage,
          useClass: MockNativeStorage, // Mock para NativeStorage
        },
        {
          provide: SQLite,
          useClass: MockSQLite, // Mock para SQLite
        },
        provideHttpClient(withInterceptorsFromDi()), // Proveedor de HttpClient con interceptores
        DataBaseService, // Proveedor para DataBaseService
        OlvideContraService, // Proveedor para OlvideContraService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Soporte para elementos personalizados
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente.
  });

  // Agrega más pruebas específicas para las funcionalidades del componente si es necesario.
});
