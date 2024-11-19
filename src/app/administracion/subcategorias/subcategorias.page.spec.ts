import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoriasPage } from './subcategorias.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importar SQLite

describe('SubcategoriasPage', () => {
  let component: SubcategoriasPage;
  let fixture: ComponentFixture<SubcategoriasPage>;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crear un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [SubcategoriasPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveer HttpClient con soporte para interceptores
        { provide: SQLite, useValue: sqliteMock }, // Proveer el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
