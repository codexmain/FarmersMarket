import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuarios } from './usuarios';
import { Categorias } from './categorias';
import { Subcategorias } from './subcategorias';
import { Productos } from './productos';
import { CmbSubcategorias } from './cmb-subcategorias';
import { CmbTipUsuario } from './cmb-tip-usuario';
import { CmbProveedores } from './cmb-proveedores';
import { CmbRegion } from './cmb-region';
import { CmbComuna } from './cmb-comuna';


@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  public database!: SQLiteObject;


  

  //variables para creacion de tablas
  tblRegion: string = `CREATE TABLE IF NOT EXISTS region (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
          )`;

  tblComuna: string = `CREATE TABLE IF NOT EXISTS comuna (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            region_id INTEGER NOT NULL,
            FOREIGN KEY (region_id) REFERENCES region(id)
          );`;

  tblTipoUsuario: string = `CREATE TABLE IF NOT EXISTS tipo_usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcion TEXT NOT NULL UNIQUE
          );`;

  tblUsuario: string = `CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            segundo_nombre TEXT,
            apellido_paterno TEXT NOT NULL,
            apellido_materno TEXT,
            email TEXT UNIQUE NOT NULL,
            contrasena TEXT NOT NULL,
            nombre_empresa TEXT,
            descripcion_corta TEXT, 
            foto_perfil TEXT,
            estado_cuenta TEXT CHECK(estado_cuenta IN ('activa', 'deshabilitada')) NOT NULL,
            fecha_registro TEXT DEFAULT(datetime('now', 'localtime')),
            tipo_usuario_id INTEGER NOT NULL,
            FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(id)
          );`;

  tblDireccion: string = `CREATE TABLE direccion(
            id INTEGER NOT NULL,  -- ID como parte de la llave compuesta
            usuario_id INTEGER NOT NULL,
            comuna_id INTEGER NOT NULL,
            direccion TEXT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id),
            FOREIGN KEY (comuna_id) REFERENCES comuna(id),
            PRIMARY KEY (id, usuario_id)  -- Llave compuesta
          );`;

  tblCategoria: string = `CREATE TABLE IF NOT EXISTS categoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
          );`;

  tblSubcategoria: string = `CREATE TABLE IF NOT EXISTS subcategoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            categoria_id INTEGER NOT NULL,
            FOREIGN KEY (categoria_id) REFERENCES categoria(id)
          );`;

  tblProducto: string = `CREATE TABLE IF NOT EXISTS producto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            proveedor_id INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio INTEGER NOT NULL,
            stock INTEGER NOT NULL,
            organico INTEGER NOT NULL CHECK(organico IN (0, 1)),
            foto_producto TEXT,
            subcategoria_id INTEGER NOT NULL,
            fecha_agregado TEXT DEFAULT(datetime('now')),
            FOREIGN KEY (proveedor_id) REFERENCES usuario(id),
            FOREIGN KEY (subcategoria_id) REFERENCES subcategoria(id)
          );`;

  tblCarroCompra: string = `CREATE TABLE IF NOT EXISTS carro_compra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            fecha_creacion TEXT DEFAULT(datetime('now')),
            total INTEGER DEFAULT 0,
            estado TEXT CHECK(estado IN ('creado', 'pagado', 'cancelado')) NOT NULL DEFAULT 'creado',
            FOREIGN KEY (usuario_id) REFERENCES usuario(id)
          );`;

  tblDetalleCarroCompra: string = `CREATE TABLE IF NOT EXISTS detalle_carro_compra (
            id INTEGER NOT NULL,
            carro_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad INTEGER NOT NULL,
            subtotal INTEGER NOT NULL,
            FOREIGN KEY (carro_id) REFERENCES carro_compra(id),
            FOREIGN KEY (producto_id) REFERENCES producto(id),
            PRIMARY KEY (id, carro_id)
          );`;

  //variables para realizar la precarga inicial de datos
  registroCategoria: string = `INSERT OR IGNORE INTO categoria (id,nombre) VALUES
            (1,'Sin Categoría'),
            (2,'Frutas'),
            (3,'Verduras'),
            (4,'Granos'),
            (5,'Lácteos'),
            (6,'Carnes'),
            (7,'Hierbas y Especias'),
            (8,'Cultivos y Semillas');`;

  registroSubcategoria: string = `INSERT OR IGNORE INTO subcategoria (id,nombre,categoria_id) VALUES
            (1,'Sin Subcategoría',1),
            (2,'Manzanas',2),
            (3,'Peras',2),
            (4,'Plátanos',2),
            (5,'Cítricos',2),
            (6,'Berries',2),
            (7,'Otras Frutas',2),
            (8,'Hortalizas de raiz',3),
            (9,'Hortalizas de hoja',3),
            (10,'Germinados, brotes y microgreens',3),
            (11,'Otras Verduras',3),
            (12,'Arroz',4),
            (13,'Quinoa',4),
            (14,'Frijoles/Porotos',4),
            (15,'Lentejas',4),
            (16,'Otros Granos',4),
            (17,'Leche',5),
            (18,'Yogur',5),
            (19,'Queso',5),
            (20,'Mantequilla',5),
            (21,'Otros Lácteos',5),
            (22,'Pollo',6),   
            (23,'Res/Vacuno',6),
            (24,'Cerdo',6),
            (25,'Pescados',6),
            (26,'Otras Carnes',6),
            (27,'Albahaca',7),
            (28,'Perejil',7),
            (29,'Romero',7),
            (30,'Canela',7),
            (31,'Merkén',7),
            (32,'Cilantro',7),
            (33,'Otras Hierbas/Especias',7),
            (34,'Semillas',8),
            (35,'Tubérculos',8),
            (36,'Semillas Heirlooms/Herencia',8),
            (37,'Rizomas',8),
            (38,'Otros Cultivos y Semillas',8);`;

  registroTipoUsuario: string = `INSERT OR IGNORE INTO tipo_usuario (id,descripcion) VALUES
            (1,'Cliente'),
            (2,'Vendedor'),
            (3,'Administrador');`;

  registroRegion: string = `INSERT OR IGNORE INTO region (id,nombre) VALUES
            (1,'Región de Arica y Parinacota'),
            (2,'Región de Tarapacá'),
            (3,'Región de Antofagasta'),
            (4,'Región de Atacama'),
            (5,'Región de Coquimbo'),
            (6,'Región de Valparaíso'),
            (7,'Región Metropolitana'),
            (8,'Región de O''Higgins'),
            (9,'Región del Maule'),
            (10,'Región de Ñuble'),
            (11,'Región del Biobío'),
            (12,'Región de La Araucanía'),
            (13,'Región de Los Ríos'),
            (14,'Región de Los Lagos'),
            (15,'Región de Aysén'),
            (16,'Región de Magallanes y de la Antártica Chilena');`;

  registroComuna: string = `INSERT OR IGNORE INTO comuna (id, nombre, region_id) VALUES
            (1, 'Arica', 1),
            (2, 'Parinacota', 1),
            (3, 'Putre', 1),
            (4, 'Camino a Putre', 1),
            (5, 'General Lagos', 1),
            (6, 'Iquique', 2),
            (7, 'Alto Hospicio', 2),
            (8, 'Pica', 2),
            (9, 'Pozo Almonte', 2),
            (10, 'Camiña', 2),
            (11, 'Antofagasta', 3),
            (12, 'Calama', 3),
            (13, 'Tocopilla', 3),
            (14, 'San Pedro de Atacama', 3),
            (15, 'Mejillones', 3),
            (16, 'Copiapó', 4),
            (17, 'Caldera', 4),
            (18, 'Tierra Amarilla', 4),
            (19, 'Freirina', 4),
            (20, 'Huasco', 4),
            (21, 'La Serena', 5),
            (22, 'Coquimbo', 5),
            (23, 'Ovalle', 5),
            (24, 'Andacollo', 5),
            (25, 'Vicuña', 5),
            (26, 'Valparaíso', 6),
            (27, 'Viña del Mar', 6),
            (28, 'Quilpué', 6),
            (29, 'San Antonio', 6),
            (30, 'Los Andes', 6),
            (31, 'Colina', 7),
            (32, 'Lampa', 7),
            (33, 'Til Til', 7),
            (34, 'Pirque', 7),
            (35, 'Puente Alto', 7),
            (36, 'San José de Maipo', 7),
            (37, 'Buin', 7),
            (38, 'Calera de Tango', 7),
            (39, 'Paine', 7),
            (40, 'San Bernardo', 7),
            (41, 'Alhué', 7),
            (42, 'Curacaví', 7),
            (43, 'María Pinto', 7),
            (44, 'Melipilla', 7),
            (45, 'San Pedro', 7),
            (46, 'Cerrillos', 7),
            (47, 'Cerro Navia', 7),
            (48, 'Conchalí', 7),
            (49, 'El Bosque', 7),
            (50, 'Estación Central', 7),
            (51, 'Huechuraba', 7),
            (52, 'Independencia', 7),
            (53, 'La Cisterna', 7),
            (54, 'La Granja', 7),
            (55, 'La Florida', 7),
            (56, 'La Pintana', 7),
            (57, 'La Reina', 7),
            (58, 'Las Condes', 7),
            (59, 'Lo Barnechea', 7),
            (60, 'Lo Espejo', 7),
            (61, 'Lo Prado', 7),
            (62, 'Macul', 7),
            (63, 'Maipú', 7),
            (64, 'Ñuñoa', 7),
            (65, 'Pedro Aguirre Cerda', 7),
            (66, 'Peñalolén', 7),
            (67, 'Providencia', 7),
            (68, 'Pudahuel', 7),
            (69, 'Quilicura', 7),
            (70, 'Quinta Normal', 7),
            (71, 'Recoleta', 7),
            (72, 'Renca', 7),
            (73, 'San Miguel', 7),
            (74, 'San Joaquín', 7),
            (75, 'San Ramón', 7),
            (76, 'Santiago', 7),
            (77, 'Vitacura', 7),
            (78, 'El Monte', 7),
            (79, 'Isla de Maipo', 7),
            (80, 'Padre Hurtado', 7),
            (81, 'Peñaflor', 7),
            (82, 'Talagante', 7),
            (83, 'Rancagua', 8),
            (84, 'San Fernando', 8),
            (85, 'Machalí', 8),
            (86, 'Pichilemu', 8),
            (87, 'Santa Cruz', 8),
            (88, 'Talca', 9),
            (89, 'Curicó', 9),
            (90, 'Linares', 9),
            (91, 'Molina', 9),
            (92, 'Cauquenes', 9),
            (93, 'Chillán', 10),
            (94, 'Chillán Viejo', 10),
            (95, 'Pemuco', 10),
            (96, 'San Carlos', 10),
            (97, 'Yungay', 10),
            (98, 'Concepción', 11),
            (99, 'Talcahuano', 11),
            (100, 'Los Ángeles', 11),
            (101, 'Chillán', 11),
            (102, 'Coronel', 11),
            (103, 'Temuco', 12),
            (104, 'Padre Las Casas', 12),
            (105, 'Villarrica', 12),
            (106, 'Pucón', 12),
            (107, 'Freire', 12),
            (108, 'Valdivia', 13),
            (109, 'La Unión', 13),
            (110, 'Río Bueno', 13),
            (111, 'Lago Ranco', 13),
            (112, 'Futrono', 13),
            (113, 'Puerto Montt', 14),
            (114, 'Osorno', 14),
            (115, 'Puerto Varas', 14),
            (116, 'Castro', 14),
            (117, 'Ancud', 14),
            (118, 'Coyhaique', 15),
            (119, 'Puerto Aysén', 15),
            (120, 'Chile Chico', 15),
            (121, 'Cisnes', 15),
            (122, 'Lago Verde', 15),
            (123, 'Punta Arenas', 16),
            (124, 'Puerto Natales', 16),
            (125, 'Porvenir', 16),
            (126, 'Cerro Castillo', 16),
            (127, 'Timaukel', 16);`;

  registroUsuario: string = `INSERT OR IGNORE INTO usuario (id,nombre,segundo_nombre,apellido_paterno,apellido_materno,email,contrasena,nombre_empresa,descripcion_corta,foto_perfil,estado_cuenta,fecha_registro,tipo_usuario_id) VALUES
            (1,'N/A','','N/A','N/A','N/A','123456',NULL,NULL,NULL,'deshabilitada','2024-10-04 22:41:12',1),
            (2,'Vicente',NULL,'Rivera','Álvarez','example.Client@gmail.com','123456',NULL,NULL,NULL,'activa','2024-10-04 22:41:12',1),
            (3,'Alvaro','Israel','Barrera','Silva','example.Seller1@gmail.com','123456','Las Cosechas de Don Barrera','Se venden hortalizas de estación. ',NULL,'activa','2024-10-04 22:41:12',2),
            (4,'Albert','Andrés','Vargas','Mansilla','example.Seller2@gmail.com','123456','Los Frutales de Mansilla','Ofrecemos cosechas frescas de frutales, con metodología regenerativa biointensiva',NULL,'activa','2024-10-04 22:41:12',2),
            (5,'Ignacio','Javier','Fuenzalida','Chandia','example.Admin@gmail.com','123456',NULL,NULL,NULL,'activa','2024-10-04 22:41:12',3);`;

  registroProducto: string = `INSERT OR IGNORE INTO producto (id,proveedor_id,nombre,descripcion,precio,stock,organico,foto_producto,subcategoria_id,fecha_agregado) VALUES
            (1,1,'Producto Desconocido','Descripción genérica para productos desconocidos.',0,0,0,NULL,1,'2024-10-04 20:20:28'),
            (2,3,'Manzana Roja','Manzana fresca y crujiente (500g).',1000,50,1,NULL,2,'2024-10-04 20:20:28'),
            (3,3,'Pera Williams','Deliciosas peras Williams (600g).',1200,30,1,NULL,3,'2024-10-04 20:20:28'),
            (4,3,'Plátano','Plátano maduro y dulce (1kg).',800,40,0,NULL,4,'2024-10-04 20:20:28'),
            (5,3,'Cítricos Variados','Mezcla de cítricos frescos (1kg).',1500,20,1,NULL,5,'2024-10-04 20:20:28'),
            (6,3,'Berries Mixtos','Fresas, arándanos y frambuesas (300g).',2000,15,1,NULL,6,'2024-10-04 20:20:28'),
            (7,3,'Zanahorias','Zanahorias frescas y crujientes (1kg).',700,25,0,NULL,8,'2024-10-04 20:20:28'),
            (8,3,'Lechuga','Lechuga fresca y crujiente (300g).',600,35,0,NULL,9,'2024-10-04 20:20:28'),
            (9,3,'Tomates','Tomates rojos y jugosos (1kg).',900,50,1,NULL,10,'2024-10-04 20:20:28'),
            (10,3,'Queso Fresco','Queso fresco y cremoso (200g).',2500,10,1,NULL,19,'2024-10-04 20:20:28'),
            (11,4,'Mantequilla','Mantequilla fresca y cremosa (250g).',3000,12,0,NULL,20,'2024-10-04 20:20:28'),
            (12,4,'Pollo Entero','Pollo fresco y de calidad (2kg).',5000,8,1,NULL,22,'2024-10-04 20:20:28'),
            (13,4,'Res Cortada','Carne de res fresca y de calidad (1kg).',8000,5,0,NULL,23,'2024-10-04 20:20:28'),
            (14,4,'Cerdo Cortado','Carne de cerdo fresca (1kg).',7000,6,0,NULL,24,'2024-10-04 20:20:28'),
            (15,4,'Salmón','Salmón fresco y saludable (300g).',12000,4,1,NULL,25,'2024-10-04 20:20:28'),
            (16,4,'Albahaca','Albahaca fresca para tus platos (50g).',500,30,1,NULL,27,'2024-10-04 20:20:28'),
            (17,4,'Perejil','Perejil fresco y aromático (50g).',400,40,0,NULL,28,'2024-10-04 20:20:28'),
            (18,4,'Romero','Romero fresco para tus recetas (30g).',600,35,1,NULL,29,'2024-10-04 20:20:28'),
            (19,4,'Canela','Canela en rama para tus postres (100g).',200,50,0,NULL,30,'2024-10-04 20:20:28'),
            (20,4,'Semillas de Chía','Semillas de chía saludables (200g).',1000,20,1,NULL,34,'2024-10-04 20:20:28'),
            (21,4,'Quinoa','Quinoa orgánica y nutritiva (500g).',3000,15,1,NULL,13,'2024-10-04 20:20:28');`;


  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);            

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) { 
    this.createBD();
  }

  async presentAlert(titulo: string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }  


  //Funciones tablas se activa al ingresar al login (Faltan algunas y por corregir)
  createBD(){
    //varificar si la plataforma esta disponible
    this.platform.ready().then(()=>{
      //crear la Base de Datos
      this.sqlite.create({
        name: 'cutuco.db',
        location: 'default'
      }).then((db: SQLiteObject)=>{
        //capturar la conexion a la BD
        this.database = db;
        //llamamos a la función para crear las tablas
        this.crearTablas();
      }).catch(e=>{
        this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
      })
    })

  }

  async crearTablas(){
    try{
      //ejecuto la creación de Tablas
      await this.database.executeSql(this.tblRegion, []);
      await this.database.executeSql(this.tblComuna, []);
      await this.database.executeSql(this.tblTipoUsuario, []);
      await this.database.executeSql(this.tblUsuario, []);
      await this.database.executeSql(this.tblDireccion, []);
      await this.database.executeSql(this.tblCategoria, []);
      await this.database.executeSql(this.tblSubcategoria, []);
      await this.database.executeSql(this.tblProducto, []);
      await this.database.executeSql(this.tblCarroCompra, []);
      await this.database.executeSql(this.tblDetalleCarroCompra, []);

      //ejecuto los insert por defecto en el caso que existan
      await this.database.executeSql(this.registroCategoria, []);
      await this.database.executeSql(this.registroSubcategoria, []);
      await this.database.executeSql(this.registroTipoUsuario, []);
      await this.database.executeSql(this.registroRegion, []);
      await this.database.executeSql(this.registroComuna, []);
      await this.database.executeSql(this.registroUsuario, []);
      await this.database.executeSql(this.registroProducto, []);

      this.isDBReady.next(true);

    }catch(e){
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }



  //Guardar usuarios en la base de datos (pendiente ingreso de productos y otros)
  registrarUsuarios(
    pNombre: string, sNombre: string, aPaterno: string, aMaterno: string,
    email: string, password: string, empresa: string,
    region: string, comuna: string, direccion: string
  ) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default',
    }).then((db: SQLiteObject) => {
    // Insertar el usuario en la tabla Usuarios
    db.executeSql(
      `INSERT INTO Usuarios(primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, email, contrasena, nombre_empresa) 
       VALUES(?,?,?,?,?,?,?,?)`, 
      [pNombre, sNombre, aPaterno, aMaterno, email, password, empresa,]
    ).then((res) => {
      console.log('Mensaje: Cuenta usuario creada');
      
      // Obtener el ID del usuario recién creado
      const usuarioId = res.insertId;

      // Insertar la dirección del usuario en la tabla Direcciones, ahora con region_id
      db.executeSql(
        `INSERT INTO Direcciones(usuario_id, comuna_id, region_id, direccion) 
         VALUES(?, (SELECT id FROM Comunas WHERE nombre = ?), (SELECT id FROM Regiones WHERE nombre = ?), ?)`, 
        [usuarioId, comuna, region, direccion]
      ).then(() => {
        console.log('Mensaje: Dirección registrada');
      }).catch((e) => {
        console.log('Mensaje: ERROR al guardar Dirección: ' + JSON.stringify(e));
      });

    }).catch((e) => {
      console.log('Mensaje: ERROR al guardar Usuario: ' + JSON.stringify(e));
    });

  }).catch((e) => {
    console.log('Mensaje: ERROR al crear o abrir DB: ' + JSON.stringify(e));
  });
  }




//Funcion para CRUDs pendiente modulo de administración

//variables para guardar los datos de las consultas en las tablas: datos imparciales
listadoUsuarios = new BehaviorSubject([]);
listadoCategorias = new BehaviorSubject([]);
listadoSubCategorias = new BehaviorSubject([]);
listadoProductos = new BehaviorSubject([]);

//variables para guardar los datos de las consultas en las tablas: Variables para hacer tranferencia de llaves por combobox
listadoCmbSubCategorias = new BehaviorSubject([]);
listadoCmbTipUsuario = new BehaviorSubject([]);
listadoCmbProveedores = new BehaviorSubject([]);

listadoCmbRegiones = new BehaviorSubject([]);
listadoCmbComunas = new BehaviorSubject([]);

//Declaracion de los observables para la manipulación de la data: fetch generales
fetchUsuarios(): Observable<Usuarios[]>{
  return this.listadoUsuarios.asObservable();
}
fetchUsuarioPorId(id: number): Promise<Usuarios> {
  return this.database.executeSql('SELECT * FROM usuario WHERE id = ?', [id]).then(res => { //esto es para ver el detalle de un usuario en especifico
      if (res.rows.length > 0) {
          return {
              id: res.rows.item(0).id,
              nombre: res.rows.item(0).nombre,
              segundo_nombre: res.rows.item(0).segundo_nombre,
              apellido_paterno: res.rows.item(0).apellido_paterno,
              apellido_materno: res.rows.item(0).apellido_materno,
              email: res.rows.item(0).email,
              contrasena: res.rows.item(0).contrasena,
              nombre_empresa: res.rows.item(0).nombre_empresa,
              descripcion_corta: res.rows.item(0).descripcion_corta,
              foto_perfil: res.rows.item(0).foto_perfil,
              estado_cuenta: res.rows.item(0).estado_cuenta,
              fecha_registro: res.rows.item(0).fecha_registro,
              tipo_usuario_id: res.rows.item(0).tipo_usuario_id
          };
      } else {
          throw new Error('Usuario no encontrado');
      }
  });
}


fetchCategorias(): Observable<Categorias[]>{
  return this.listadoCategorias.asObservable();
}

fetchCategoriaPorId(id: number): Promise<Categorias> { //esto es para ver el detalle de un categoria en especifico
  return this.database.executeSql('SELECT * FROM categoria WHERE id = ?', [id]).then(res => {
      if (res.rows.length > 0) {
          return {
              id: res.rows.item(0).id,
              nombre: res.rows.item(0).nombre
          };
      } else {
          throw new Error('Categoria no encontrada');
      }
  });
}




fetchSubCategorias(): Observable<Subcategorias[]>{
  return this.listadoSubCategorias.asObservable();
}

fetchSubCategoriaPorId(id: number): Promise<Subcategorias> { //esto es para ver el detalle de una subcategoria en especifico
  return this.database.executeSql('SELECT * FROM subcategoria WHERE id = ?', [id]).then(res => {
      if (res.rows.length > 0) {
          return {
              id: res.rows.item(0).id,
              nombre: res.rows.item(0).nombre,
              categoria_id: res.rows.item(0).categoria_id,
          };
      } else {
          throw new Error('Subcategoría no encontrada');
      }
  });
}


fetchProductos(): Observable<Productos[]>{
  return this.listadoProductos.asObservable();
}

fetchProductoPorId(id: number): Promise<Productos> { //esto es para ver el detalle de un producto en especifico
  return this.database.executeSql('SELECT * FROM producto WHERE id = ?', [id]).then(res => {
      if (res.rows.length > 0) {
          return {
              id: res.rows.item(0).id,
              proveedor_id: res.rows.item(0).proveedor_id,
              nombre: res.rows.item(0).nombre,
              descripcion: res.rows.item(0).descripcion,
              precio: res.rows.item(0).precio,
              stock: res.rows.item(0).stock,
              organico: res.rows.item(0).organico,
              foto_producto: res.rows.item(0).foto_producto,
              subcategoria_id: res.rows.item(0).subcategoria_id,
              fecha_agregado: res.rows.item(0).fecha_agregado
          };
      } else {
          throw new Error('Producto no encontrado');
      }
  });
}

//Declaracion de los observables para la manipulación de la data: fetch para comboboxs para transferencia de llave

fetchCmbSubCategorias(): Observable<CmbSubcategorias[]>{
  return this.listadoCmbSubCategorias.asObservable();
}
fetchCmbTipUsuario(): Observable<CmbTipUsuario[]>{
  return this.listadoCmbTipUsuario.asObservable();
}

fetchCmbProveedores(): Observable<CmbProveedores[]>{
  return this.listadoCmbProveedores.asObservable();
}

fetchCmbRegiones(): Observable<CmbRegion[]>{
  return this.listadoCmbRegiones.asObservable();
}

fetchCmbComuna(): Observable<CmbComuna[]>{
  return this.listadoCmbComunas.asObservable();
}


//CRUD USUARIOS, parte administración. Todos los SELECTS
seleccionarUsuarios(){
  return this.database.executeSql('SELECT * FROM usuario', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: Usuarios[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).nombre,
          segundo_nombre: res.rows.item(i).segundo_nombre,
          apellido_paterno: res.rows.item(i).apellido_paterno,
          apellido_materno: res.rows.item(i).apellido_materno,
          email: res.rows.item(i).email,
          contrasena: res.rows.item(i).contrasena,
          nombre_empresa: res.rows.item(i).nombre_empresa,
          descripcion_corta: res.rows.item(i).descripcion_corta,
          foto_perfil: res.rows.item(i).foto_perfil,
          estado_cuenta: res.rows.item(i).estado_cuenta,
          fecha_registro: res.rows.item(i).fecha_registro,
          tipo_usuario_id: res.rows.item(i).tipo_usuario_id
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoUsuarios.next(items as any);
  })
}


seleccionarCategorias(){
  return this.database.executeSql('SELECT * FROM categoria', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: Categorias[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).nombre
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoCategorias.next(items as any);
  })
}

seleccionarSubCategorias(){
  return this.database.executeSql('SELECT * FROM subcategoria', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: Subcategorias[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).nombre,
          categoria_id: res.rows.item(i).categoria_id,
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoSubCategorias.next(items as any);
  })
}


seleccionarProductos(){
  return this.database.executeSql('SELECT * FROM usuario', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: Productos[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          proveedor_id: res.rows.item(i).proveedor_id,
          nombre: res.rows.item(i).nombre,
          descripcion: res.rows.item(i).descripcion,
          precio: res.rows.item(i).precio,
          stock: res.rows.item(i).stock,
          organico: res.rows.item(i).organico,
          foto_producto: res.rows.item(i).foto_producto,
          subcategoria_id: res.rows.item(i).subcategoria_id,
          fecha_agregado: res.rows.item(i).fecha_agregado
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoProductos.next(items as any);
  })
}

//creacion de las queries para los combobox

seleccionarCbmProveedores(){
  return this.database.executeSql('SELECT id, nombre_empresa FROM usuario WHERE nombre_empresa NOTNULL', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: CmbProveedores[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre_empresa: res.rows.item(i).id,
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoCmbProveedores.next(items as any);
  })
}


seleccionarCmbSubCategorias(id: number){
  return this.database.executeSql('SELECT id, nombre FROM sbcategoria WHERE categoria_id = ?', [id]).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: CmbSubcategorias[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).id,
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoCmbSubCategorias.next(items as any);
  })
}



seleccionarCmbTipUsuario(){
  return this.database.executeSql('SELECT * FROM tipo_usuario', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: CmbTipUsuario[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          descripcion: res.rows.item(i).id,
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoCmbTipUsuario.next(items as any);
  })
}

seleccionarCmbRegiones(){
  return this.database.executeSql('SELECT * FROM region', []).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: CmbRegion[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).nombre
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoCmbRegiones.next(items as any);
  })
}

seleccionarCmbComunas(id: number){
  return this.database.executeSql('SELECT id, nombre FROM subcategoria WHERE region_id = ?', [id]).then(res=>{
     //variable para almacenar el resultado de la consulta
     let items: CmbComuna[] = [];
     //valido si trae al menos un registro
     if(res.rows.length > 0){
      //recorro mi resultado
      for(var i=0; i < res.rows.length; i++){
        //agrego los registros a mi lista
        items.push({
          id: res.rows.item(i).id,
          nombre: res.rows.item(i).id,
        })
      }
     }
     //actualizar el observable de usuarios
     this.listadoCmbComunas.next(items as any);
  })
}



//todos los modificares

modificarUsuario(id:number, nombre:string, segundo_nombre:string, apellido_paterno:string,
                apellido_materno:string, email:string, contrasena:string, nombre_empresa:string, 
                descripcion_corta:string, foto_perfil:string, estado_cuenta:string, 
                tipo_usuario_id:number){
                  this.presentAlert("service","ID: " + id);
                  return this.database.executeSql('UPDATE usuario SET nombre = ?, segundo_nombre = ?, apellido_paterno = ?, apellido_materno = ?, email = ?, contrasena = ?, nombre_empresa = ?, descripcion_corta = ?, foto_perfil = ?, estado_cuenta = ?, tipo_usuario_id = ?  WHERE id = ?',[nombre,segundo_nombre,apellido_paterno,apellido_materno,email,contrasena,nombre_empresa,descripcion_corta,foto_perfil,estado_cuenta,tipo_usuario_id,id]).then(res=>{
                    this.presentAlert("Modificar","Usuario Modificado");
                    this.seleccionarUsuarios();
                  }).catch(e=>{
                    this.presentAlert('Modificar Usuario', 'Error: ' + JSON.stringify(e));
                  })}



modificarCategoria(id:number, nombre:string){
  this.presentAlert("service","ID: " + id);
  return this.database.executeSql('UPDATE categoria SET nombre = ? WHERE id = ?',[nombre,id]).then(res=>{
    this.presentAlert("Modificar","Categoría Modificada");
    this.seleccionarCategorias();
  }).catch(e=>{
    this.presentAlert('Modificar Categoría', 'Error: ' + JSON.stringify(e));
  })
}

modificarSubCategoria(id:number, nombre:string, categoria_id:number){
  this.presentAlert("service","ID: " + id);
  return this.database.executeSql('UPDATE subcategoria SET nombre = ?, categoria_id = ? WHERE id = ?',[nombre,categoria_id,id]).then(res=>{
    this.presentAlert("Modificar","SubCategoría Modificada");
    this.seleccionarSubCategorias();
  }).catch(e=>{
    this.presentAlert('Modificar SubCategoría', 'Error: ' + JSON.stringify(e));
  })
}

modificarProducto(id:number, proveedor_id:number, nombre:string, descripcion:string, precio:number, stock:number, organico:number, foto_producto:string, subcategoria_id:number){
  this.presentAlert("service","ID: " + id);
  return this.database.executeSql('UPDATE producto SET proveedor_id = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, organico = ?, foto_producto = ?, subcategoria_id = ? WHERE id = ?',[proveedor_id,nombre,descripcion,precio,stock,organico,foto_producto,subcategoria_id,id]).then(res=>{
    this.presentAlert("Modificar","Producto Modificado");
    this.seleccionarProductos();
  }).catch(e=>{
    this.presentAlert('Modificar Producto', 'Error: ' + JSON.stringify(e));
  })
}


//todos los inserts.

insertarUsuario(nombre:string, segundo_nombre:string, apellido_paterno:string,
                apellido_materno:string, email:string, contrasena:string, nombre_empresa:string, 
                descripcion_corta:string, foto_perfil:string, estado_cuenta:string, 
                tipo_usuario_id:number, comuna_id:number, direccion: string){
                  return this.database.executeSql('INSERT INTO usuario(nombre, segundo_nombre, apellido_paterno, apellido_materno, email, contrasena, nombre_empresa, descripcion_corta, foto_perfil, estado_cuenta, tipo_usuario_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[nombre,segundo_nombre,apellido_paterno,apellido_materno,email,contrasena,nombre_empresa,descripcion_corta,foto_perfil,estado_cuenta,tipo_usuario_id]).then(res => {
                    const usuarioId = res.insertId; // Obtener el ID del nuevo usuario
            
                    // Ahora insertar la dirección asociada al usuario
                    return this.database.executeSql(
                        'INSERT INTO direccion(id, usuario_id, comuna_id, direccion) VALUES (?,?,?,?)',
                        [1, usuarioId, comuna_id, direccion]
                    );
                }).then(() => {
                    this.presentAlert("Insertar", "Usuario y dirección registrados con éxito"); //despues al llegar a la parte de direcciones se hace la query, observador de direcciones no hay
                    this.seleccionarUsuarios(); // Actualizar la lista de usuarios
                }).catch(e => {
                    this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
                });
            }

insertarCategoria(nombre:string){
  return this.database.executeSql('INSERT INTO categoria(nombre) VALUES (?)',[nombre]).then(res=>{
    this.presentAlert("Insertar","Categoría Registrada");
    this.seleccionarCategorias();
  }).catch(e=>{
    this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
  })
}

insertarSubCategoria(nombre:string, categoria_id:number){
  return this.database.executeSql('INSERT INTO subcategoria(nombre,categoria_id) VALUES (?,?)',[nombre, categoria_id]).then(res=>{
    this.presentAlert("Insertar","Subcategoría Registrada");
    this.seleccionarSubCategorias();
  }).catch(e=>{
    this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
  })
}

insertarProducto(proveedor_id:number, nombre:string, descripcion:string, precio:number, stock:number, 
                organico:number, foto_producto:string, subcategoria_id:number){
                  return this.database.executeSql('INSERT INTO producto(proveedor_id,nombre,descripcion,precio,stock, organico, foto_producto, subcategoria_id) VALUES (?,?,?,?,?,?,?,?)',[proveedor_id, nombre, descripcion, precio, stock, organico, foto_producto, subcategoria_id]).then(res=>{
                    this.presentAlert("Insertar","Producto Registrado");
                    this.seleccionarProductos();
                  }).catch(e=>{
                    this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
                  })
                }



//================================

//accion de eliminar de todos los cruds de la parte de administracion
eliminarUsuario(id: number) {
  this.esRegistroProtegido('usuario', id).then(esProtegido => {
      if (esProtegido) {
          this.presentAlert("Eliminar", "No se puede eliminar este usuario porque es un registro protegido.");
      } else {
          // Actualizar registros en las tablas que dependen de usuario
          this.database.executeSql('UPDATE producto SET proveedor_id = 1 WHERE proveedor_id = ?', [id])
              .then(() => {
                  return this.database.executeSql('UPDATE direccion SET usuario_id = 1 WHERE usuario_id = ?', [id]);
              })
              .then(() => {
                  return this.database.executeSql('UPDATE carro_compra SET usuario_id = 1 WHERE usuario_id = ?', [id]);
              })
              .then(() => {
                  // Finalmente, eliminar el usuario
                  return this.database.executeSql('DELETE FROM usuario WHERE id = ?', [id]);
              })
              .then(() => {
                  this.presentAlert("Eliminar", "Usuario eliminado con éxito");
                  this.seleccionarUsuarios(); // Actualizar la lista de usuarios
              })
              .catch(e => {
                  this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
              });
      }
  }).catch(e => {
      this.presentAlert('Eliminar', 'Error al verificar el registro: ' + JSON.stringify(e));
  });
}



eliminarCategoria(id: number) {
  this.esRegistroProtegido('categoria', id).then(esProtegido => {
      if (esProtegido) {
          this.presentAlert("Eliminar", "No se puede eliminar esta categoría porque es un registro protegido.");
      } else {
          // Actualizar subcategorías para establecer valor por defecto
          this.database.executeSql('UPDATE subcategoria SET categoria_id = 1 WHERE categoria_id = ?', [id])
              .then(() => {
                  // Luego, eliminar la categoría
                  return this.database.executeSql('DELETE FROM categoria WHERE id = ?', [id]);
              })
              .then(() => {
                  this.presentAlert("Eliminar", "Categoría eliminada con éxito");
                  this.seleccionarCategorias(); // Actualizar la lista de categorías
              })
              .catch(e => {
                  this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
              });
      }
  }).catch(e => {
      this.presentAlert('Eliminar', 'Error al verificar el registro: ' + JSON.stringify(e));
  });
}


eliminarSubcategoria(id: number) {
  this.esRegistroProtegido('subcategoria', id).then(esProtegido => {
      if (esProtegido) {
          this.presentAlert("Eliminar", "No se puede eliminar esta subcategoría porque es un registro protegido.");
      } else {
          // Actualizar registros en la tabla de productos
          this.database.executeSql('UPDATE producto SET subcategoria_id = 1 WHERE subcategoria_id = ?', [id])
              .then(() => {
                  // Finalmente, eliminar la subcategoría
                  return this.database.executeSql('DELETE FROM subcategoria WHERE id = ?', [id]);
              })
              .then(() => {
                  this.presentAlert("Eliminar", "Subcategoría eliminada con éxito");
                  this.seleccionarSubCategorias(); // Actualizar la lista de subcategorías
              })
              .catch(e => {
                  this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
              });
      }
  }).catch(e => {
      this.presentAlert('Eliminar', 'Error al verificar el registro: ' + JSON.stringify(e));
  });
}


eliminarProducto(id: number) {
  this.esRegistroProtegido('producto', id).then(esProtegido => {
      if (esProtegido) {
          this.presentAlert("Eliminar", "No se puede eliminar este producto porque es un registro protegido.");
      } else {
          // Actualizar registros en la tabla de detalle_carro_compra
          this.database.executeSql('UPDATE detalle_carro_compra SET producto_id = 1 WHERE producto_id = ?', [id])
              .then(() => {
                  // Finalmente, eliminar el producto
                  return this.database.executeSql('DELETE FROM producto WHERE id = ?', [id]);
              })
              .then(() => {
                  this.presentAlert("Eliminar", "Producto eliminado con éxito");
                  this.seleccionarProductos(); // Actualizar la lista de productos
              })
              .catch(e => {
                  this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
              });
      }
  }).catch(e => {
      this.presentAlert('Eliminar', 'Error al verificar el registro: ' + JSON.stringify(e));
  });
}





//===============================
//validaciones necesarios para formularios

verificarCorreoExistente(correo: string): Promise<boolean> {
  return this.database.executeSql('SELECT COUNT(*) AS count FROM usuario WHERE correo = ?', [correo]).then(res => {
      return res.rows.item(0).count > 0; // Devuelve true si el correo ya existe   //1 es true, 0 es false
  });
}


esRegistroProtegido(tipo: string, id: number): Promise<boolean> {
  let query: string;
  let params: any[];

  if (tipo === 'categoria') {
      query = 'SELECT COUNT(*) AS count FROM categoria WHERE id = ? AND nombre = "Sin Categoría"';
      params = [id];
  } else if (tipo === 'subcategoria') {
      query = 'SELECT COUNT(*) AS count FROM subcategoria WHERE id = ? AND nombre = "Sin Subcategoría"';
      params = [id];
  } else if (tipo === 'usuario') {
      query = 'SELECT COUNT(*) AS count FROM usuario WHERE id = ? AND nombre = "N/A"';
      params = [id];
  } else if (tipo === 'producto') {
      query = 'SELECT COUNT(*) AS count FROM producto WHERE id = ? AND nombre = "Producto Desconocido"';
      params = [id];
  } else {
      return Promise.resolve(false); // Registro no protegido
  }

  return this.database.executeSql(query, params).then(res => {
      return res.rows.item(0).count > 0; // Devuelve true si es un registro protegido
  });
}

}