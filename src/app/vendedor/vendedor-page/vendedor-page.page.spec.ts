import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioPage } from '../usuario/usuario.page';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

fdescribe('UsuarioPage', () => {
  let component: UsuarioPage;
  let fixture: ComponentFixture<UsuarioPage>;
  let dbServiceMock: any;
  let nativeStorageMock: any;

  beforeEach(async () => {
    dbServiceMock = {
      getUsuarioByEmail: jasmine.createSpy('getUsuarioByEmail').and.returnValue(Promise.resolve({ id: 1, nombre: 'Usuario Test' })),
    };

    nativeStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('test@example.com')),
    };

    await TestBed.configureTestingModule({
      declarations: [UsuarioPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule, // Importa RouterTestingModule para habilitar routerLink
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: DataBaseService, useValue: dbServiceMock },
        { provide: NativeStorage, useValue: nativeStorageMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cargarDatosUsuario', () => {
    it('debería cargar los datos del usuario usando el correo electrónico', async () => {
      await component.cargarDatosUsuario();
      expect(nativeStorageMock.getItem).toHaveBeenCalledWith('userEmail');
      expect(dbServiceMock.getUsuarioByEmail).toHaveBeenCalledWith('test@example.com');
      expect(component.usuario).toEqual({ id: 1, nombre: 'Usuario Test' });
    });

    it('debería manejar errores durante la carga de datos', async () => {
      spyOn(console, 'error');
      dbServiceMock.getUsuarioByEmail.and.returnValue(Promise.reject('Error en la base de datos'));
      await component.cargarDatosUsuario();
      expect(console.error).toHaveBeenCalledWith('Error al cargar los datos del usuario:', 'Error en la base de datos');
    });
  });
});