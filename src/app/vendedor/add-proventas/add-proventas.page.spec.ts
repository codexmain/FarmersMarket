import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProventasPage } from './add-proventas.page';

describe('AddProventasPage', () => {
  let component: AddProventasPage;
  let fixture: ComponentFixture<AddProventasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
