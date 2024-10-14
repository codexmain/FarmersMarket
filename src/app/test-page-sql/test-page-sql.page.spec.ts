import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestPageSqlPage } from './test-page-sql.page';

describe('TestPageSqlPage', () => {
  let component: TestPageSqlPage;
  let fixture: ComponentFixture<TestPageSqlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPageSqlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
