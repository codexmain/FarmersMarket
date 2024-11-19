import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarCategoriaPage } from './modificar-categoria.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('ModificarCategoriaPage', () => {
  let component: ModificarCategoriaPage;
  let fixture: ComponentFixture<ModificarCategoriaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificarCategoriaPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
