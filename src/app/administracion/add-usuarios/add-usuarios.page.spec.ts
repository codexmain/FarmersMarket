import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUsuariosPage } from './add-usuarios.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('AddUsuariosPage', () => {
  let component: AddUsuariosPage;
  let fixture: ComponentFixture<AddUsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUsuariosPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
