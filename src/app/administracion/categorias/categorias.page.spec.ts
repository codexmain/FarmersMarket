import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriasPage } from './categorias.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite

describe('CategoriasPage', () => {
  let component: CategoriasPage;
  let fixture: ComponentFixture<CategoriasPage>;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crear un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [CategoriasPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
        { provide: SQLite, useValue: sqliteMock }, // Proveer el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
