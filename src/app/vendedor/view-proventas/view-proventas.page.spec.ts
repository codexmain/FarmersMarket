import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProventasPage } from './view-proventas.page';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

describe('ViewProventasPage', () => {
  let component: ViewProventasPage;
  let fixture: ComponentFixture<ViewProventasPage>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Crea un mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula la obtención de parámetros de la ruta
    };

    await TestBed.configureTestingModule({
      declarations: [ViewProventasPage],
      imports: [IonicModule.forRoot()], // Agrega IonicModule para los componentes de Ionic
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Proporciona el mock de ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
