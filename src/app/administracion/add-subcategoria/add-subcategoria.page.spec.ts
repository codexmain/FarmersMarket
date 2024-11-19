import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSubcategoriaPage } from './add-subcategoria.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataBaseService } from 'src/app/services/data-base.service';

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
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

class MockNavParams {
  get(param: string): any {
    const mockParams: { [key: string]: any } = { id: '123' };
    return mockParams[param];
  }
}

describe('AddSubcategoriaPage', () => {
  let component: AddSubcategoriaPage;
  let fixture: ComponentFixture<AddSubcategoriaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSubcategoriaPage],
      imports: [FormsModule], // Asegúrate de importar FormsModule
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración para HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '123' }) }, // Mock para ActivatedRoute con un parámetro simulado
        },
        { provide: NavParams, useClass: MockNavParams }, // Mock para NavParams
        DataBaseService, // Proveedor para DataBaseService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
