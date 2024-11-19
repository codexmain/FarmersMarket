import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSubcategoriaPage } from './add-subcategoria.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('AddSubcategoriaPage', () => {
  let component: AddSubcategoriaPage;
  let fixture: ComponentFixture<AddSubcategoriaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSubcategoriaPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
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
