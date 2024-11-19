import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoriaPage } from './add-categoria.page';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule

describe('AddCategoriaPage', () => {
  let component: AddCategoriaPage;
  let fixture: ComponentFixture<AddCategoriaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCategoriaPage],
      imports: [
        HttpClientTestingModule, // Agrega HttpClientTestingModule en imports
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
