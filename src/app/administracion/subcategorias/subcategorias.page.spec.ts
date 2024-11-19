import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoriasPage } from './subcategorias.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('SubcategoriasPage', () => {
  let component: SubcategoriasPage;
  let fixture: ComponentFixture<SubcategoriasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubcategoriasPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
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
