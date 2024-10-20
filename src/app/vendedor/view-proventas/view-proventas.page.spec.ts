import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProventasPage } from './view-proventas.page';

describe('ViewProventasPage', () => {
  let component: ViewProventasPage;
  let fixture: ComponentFixture<ViewProventasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
