import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAmonestacionesPage } from './view-amonestaciones.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('ViewAmonestacionesPage', () => {
  let component: ViewAmonestacionesPage;
  let fixture: ComponentFixture<ViewAmonestacionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAmonestacionesPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAmonestacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
