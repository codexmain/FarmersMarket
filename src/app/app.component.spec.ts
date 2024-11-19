import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DataBaseService } from './services/data-base.service'; // Ruta correcta
import { OlvideContraService } from './services/olvide-contra.service'; // Ruta correcta
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

class MockNativeStorage {
  getItem() {
    return Promise.resolve({});
  }
  setItem() {
    return Promise.resolve({});
  }
}

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveedor para HttpClient
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        DataBaseService, // Servicio relacionado
        OlvideContraService, // Servicio relacionado
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
