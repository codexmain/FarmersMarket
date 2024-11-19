import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaPage } from './cuenta.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('CuentaPage', () => {
  let component: CuentaPage;
  let fixture: ComponentFixture<CuentaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CuentaPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con interceptores
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
