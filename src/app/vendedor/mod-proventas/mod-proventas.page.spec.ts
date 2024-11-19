import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModProventasPage } from './mod-proventas.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormsModule y ReactiveFormsModule
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importa NativeStorage

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
    return Promise.resolve('mockData'); // Devuelve un dato simulado
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve(); // Simula una operación exitosa
  }
}

describe('ModProventasPage', () => {
  let component: ModProventasPage;
  let fixture: ComponentFixture<ModProventasPage>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Crea un mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula la obtención de parámetros de la ruta
    };

    await TestBed.configureTestingModule({
      declarations: [ModProventasPage],
      imports: [
        IonicModule.forRoot(), // Configuración para componentes de Ionic
        HttpClientTestingModule, // Configuración para HttpClient
        FormsModule, // Soporte para [(ngModel)]
        ReactiveFormsModule, // Soporte para formularios reactivos
        RouterTestingModule, // Simula rutas
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Mock para ActivatedRoute
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
