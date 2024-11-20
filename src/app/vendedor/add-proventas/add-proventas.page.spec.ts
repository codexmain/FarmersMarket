import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProventasPage } from './add-proventas.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para NativeStorage
class MockNativeStorage {
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData');
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve();
  }
}

describe('AddProventasPage', () => {
  let component: AddProventasPage;
  let fixture: ComponentFixture<AddProventasPage>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
    };

    await TestBed.configureTestingModule({
      declarations: [AddProventasPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SQLite, useClass: MockSQLite },
        { provide: NativeStorage, useClass: MockNativeStorage },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(AddProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
