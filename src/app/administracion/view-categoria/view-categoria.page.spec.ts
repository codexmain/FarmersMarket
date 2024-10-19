import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCategoriaPage } from './view-categoria.page';

describe('ViewCategoriaPage', () => {
  let component: ViewCategoriaPage;
  let fixture: ComponentFixture<ViewCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
