import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSellerPage } from './add-seller.page';

describe('AddSellerPage', () => {
  let component: AddSellerPage;
  let fixture: ComponentFixture<AddSellerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
