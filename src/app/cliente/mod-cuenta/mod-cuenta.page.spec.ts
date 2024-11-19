import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModCuentaPage } from './mod-cuenta.page';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule

describe('ModCuentaPage', () => {
  let component: ModCuentaPage;
  let fixture: ComponentFixture<ModCuentaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModCuentaPage],
      imports: [
        HttpClientTestingModule, // Agrega HttpClientTestingModule en imports
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
