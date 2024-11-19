import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModProventasPage } from './mod-proventas.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule

describe('ModProventasPage', () => {
  let component: ModProventasPage;
  let fixture: ComponentFixture<ModProventasPage>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Crea un mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula la obtención de parámetros de la ruta
    };

    await TestBed.configureTestingModule({
      declarations: [ModProventasPage],
      imports: [
        IonicModule.forRoot(), // Agrega IonicModule para los componentes de Ionic
        HttpClientTestingModule, // Agrega HttpClientTestingModule en imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Proporciona el mock de ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
