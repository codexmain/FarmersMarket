import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoriaPage } from './add-categoria.page';

describe('AddCategoriaPage', () => {
  let component: AddCategoriaPage;
  let fixture: ComponentFixture<AddCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
