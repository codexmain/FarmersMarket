import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegventasPage } from './regventas.page';

describe('RegventasPage', () => {
  let component: RegventasPage;
  let fixture: ComponentFixture<RegventasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
