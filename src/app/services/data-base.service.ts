import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

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
listadoCmbCategorias = new BehaviorSubject([]);
listadoCmbSubCategorias = new BehaviorSubject([]);
listadoCmbTipUsuario = new BehaviorSubject([]);
listadoCmbProveedores = new BehaviorSubject([]);

//Declaracion de los observables para la manipulación de la data: fetch generales
fetchUsuarios
fetchCategorias
fetchSubCategorias
fetchProductos

//Declaracion de los observables para la manipulación de la data: fetch para comboboxs para transferencia de llave

fetchCmbSubCategorias
fetchCmbTipUsuario
fetchCmbProveedores



//CRUD USUARIOS, parte administración
seleccionarUsuarios{ }

eliminarUsuario{ }

modificarUsuario{ }

insertarUsuario { }


//CRUD CATEGORIA, parte administración
seleccionarCategorias{ } 

eliminarCategoria { }

modificarCategoria { }

insertarCategoria { }


//CRUD SUBCATEGORIA, parte administración
seleccionarSubCategorias { }

eliminarSubCategoria { }

modificarSubCategoria { }

insertarSubCategoria{ }


//CRUD Producto, parte administración
seleccionarProductos { }

eliminarProducto { }

modificarProducto { }

insertarProducto { }

}
