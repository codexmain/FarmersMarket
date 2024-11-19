import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProventasPage } from './proventas.page';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ProventasPage', () => {
  let component: ProventasPage;
  let fixture: ComponentFixture<ProventasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProventasPage],
      imports: [
        IonicModule.forRoot(), // Soporte para componentes de Ionic
        FormsModule, // Para formularios con [(ngModel)]
        ReactiveFormsModule, // Para formularios reactivos
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración de HttpClient
        provideRouter([]), // Configuración moderna de rutas vacías para pruebas
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
