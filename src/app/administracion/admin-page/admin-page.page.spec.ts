import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPagePage } from './admin-page.page';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { OlvideContraService } from 'src/app/services/olvide-contra.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
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

describe('AdminPagePage', () => {
  let component: AdminPagePage;
  let fixture: ComponentFixture<AdminPagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPagePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Mock para ActivatedRoute
            queryParams: of({ filter: 'mockFilter' }), // Agrega mock para queryParams si es necesario
          },
        },
        {
          provide: NativeStorage,
          useClass: MockNativeStorage, // Mock para NativeStorage
        },
        {
          provide: SQLite,
          useClass: MockSQLite, // Mock para SQLite
        },
        provideHttpClient(withInterceptorsFromDi()), // Configuración moderna para HttpClient
        DataBaseService, // Proveedor para DataBaseService
        OlvideContraService, // Proveedor para OlvideContraService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle route parameters', () => {
    // Asegúrate de que el parámetro de la ruta esté configurado correctamente
    component.ngOnInit();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    // Agrega más verificaciones si el componente realiza lógica basada en los parámetros de la ruta
  });
});
