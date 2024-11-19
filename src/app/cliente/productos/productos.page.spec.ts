import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage } from './productos.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;
  let activatedRouteMock: any;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crea un mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula la obtención de parámetros de la ruta
    };

    // Crea un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ProductosPage],
      imports: [
        IonicModule.forRoot(), // Agrega IonicModule para los componentes de Ionic
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Proporciona el mock de ActivatedRoute
        { provide: SQLite, useValue: sqliteMock }, // Proporciona el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
