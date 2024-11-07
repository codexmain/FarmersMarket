import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAmonestacionesPage } from './view-amonestaciones.page';

describe('ViewAmonestacionesPage', () => {
  let component: ViewAmonestacionesPage;
  let fixture: ComponentFixture<ViewAmonestacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAmonestacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
