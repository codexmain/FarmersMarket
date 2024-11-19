import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProventasPage } from './view-proventas.page';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute

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
