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
          );`;

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

  tblDireccion: string = `CREATE TABLE IF NOT EXISTS direccion(
            id INTEGER NOT NULL,  -- ID como parte de la llave compuesta
            usuario_id INTEGER NOT NULL,
            comuna_id INTEGER NOT NULL,
            direccion TEXT NOT NULL,
            preferida INTEGER DEFAULT 0,
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
            id INTEGER,
            carro_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad INTEGER NOT NULL,
            subtotal INTEGER NOT NULL,
            producto_identificador TEXT,
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
            (1,'N/A','','N/A','N/A','N/A','123456','Empresa Inexistente','Empresa Inexistente',NULL,'deshabilitada','2024-10-04 22:41:12',1),
            (2,'Alvaro','Israel','Barrera','Silva','example.Seller1@gmail.com','123456','Las Cosechas de Don Barrera','Se venden hortalizas de estación. ',NULL,'activa','2024-10-04 22:41:12',2),
            (3,'Vicente',NULL,'Rivera','Álvarez','example.Client@gmail.com','123456',NULL,NULL,NULL,'activa','2024-10-04 22:41:12',1),            
            (4,'Albert','Andrés','Vargas','Mansilla','example.Seller2@gmail.com','123456','Los Frutales de Mansilla','Ofrecemos cosechas frescas de frutales, con metodología regenerativa biointensiva',NULL,'activa','2024-10-04 22:41:12',2),
            (5,'Ignacio','Javier','Fuenzalida','Chandia','example.Admin@gmail.com','123456',NULL,NULL,NULL,'activa','2024-10-04 22:41:12',3);`;

  registroDireccion: string = `INSERT OR IGNORE INTO direccion (id,usuario_id,comuna_id,direccion,preferida ) VALUES
            (1,3,51,'El Sauce 1200.',0),
            (1,2,44,'Av. Independencia 4599',0),
            (1,4,26,'Mena 665.',0);`;


  registroProducto: string = `INSERT OR IGNORE INTO producto (id, proveedor_id, nombre, descripcion, precio, stock, organico, foto_producto, subcategoria_id, fecha_agregado) VALUES
  (1, 1, 'Producto Desconocido', 'Descripción genérica para productos desconocidos.', 0, 0, 0, NULL, 1, '2024-10-04 20:20:28'),
  (2, 2, 'Manzana Roja', 'Manzana fresca y crujiente (500g).', 1000, 50, 1, NULL, 2, '2024-10-04 20:20:28'),
  (3, 2, 'Pera Williams', 'Deliciosas peras Williams (600g).', 1200, 30, 1, NULL, 3, '2024-10-04 20:20:28'),
  (4, 2, 'Plátano', 'Plátano maduro y dulce (1kg).', 800, 40, 0, NULL, 4, '2024-10-04 20:20:28'),
  (5, 2, 'Cítricos Variados', 'Mezcla de cítricos frescos (1kg).', 1500, 20, 1, NULL, 5, '2024-10-04 20:20:28'),
  (6, 2, 'Berries Mixtos', 'Fresas, arándanos y frambuesas (300g).', 2000, 15, 1, NULL, 6, '2024-10-04 20:20:28'),
  (7, 2, 'Zanahorias', 'Zanahorias frescas y crujientes (1kg).', 700, 25, 0, NULL, 8, '2024-10-04 20:20:28'),
  (8, 2, 'Lechuga', 'Lechuga fresca y crujiente (300g).', 600, 35, 0, NULL,9,'2024-10-04 20:20:28'),
  (9 ,2 ,'Tomates','Tomates rojos y jugosos (1kg).',900 ,50 ,1 , NULL,10 ,'2024-10-04 20:20:28'),
  (10 ,2 ,'Queso Fresco','Queso fresco y cremoso (200g).',2500 ,10 ,1 , NULL,19 ,'2024-10-04 20:20:28'),
  (11 ,4 ,'Mantequilla','Mantequilla fresca y cremosa (250g).',3000 ,12 ,0 , NULL,20 ,'2024-10-04 20:20:28'),
  (12 ,4 ,'Pollo Entero','Pollo fresco y de calidad (2kg).',5000 ,8 ,1 , NULL,22 ,'2024-10-04 20:20:28'),
  (13 ,4 ,'Res Cortada','Carne de res fresca y de calidad (1kg).',8000 ,5 ,0 , NULL,23 ,'2024-10-04 20:20:28'),
  (14 ,4 ,'Cerdo Cortado','Carne de cerdo fresca (1kg).',7000 ,6 ,0 , NULL,24 ,'2024-10-04 20:20:28'),
  (15 ,4 ,'Salmón','Salmón fresco y saludable (300g).',12000 ,4 ,1 , NULL,25 ,'2024-10-04 20:20:28'),
  (16 ,4 ,'Albahaca','Albahaca fresca para tus platos (50g).',500 ,30 ,1 , NULL,27 ,'2024-10-04 20:20:28'),
  (17 ,4 ,'Perejil','Perejil fresco y aromático (50g).',400 ,40 ,0 , NULL,28 ,'2024-10-04 20:20:28'),
  (18 ,4 ,'Romero','Romero fresco para tus recetas (30g).',600 ,35 ,1 , NULL,29 ,'2024-10-04 20:20:28'),
  (19 ,4 ,'Canela','Canela en rama para tus postres (100g).',200 ,50 ,0 , NULL,30 ,'2024-10-04 20:20:28'),
  (20 ,4 ,'Semillas de Chía','Semillas de chía saludables (200g).',1000 ,20 ,1 , NULL,34 ,'2024-10-04 20:20:28'),
  (21 ,4,'Quinoa','Quinoa orgánica y nutritiva(500 g)',3000,'15','1',NULL ,13,'20241004202028');`;

  //declaracion de las tablas de respaldo, para compararlo con la inserccion inicial

  tblRespaldoCategoria: string = `CREATE TABLE IF NOT EXISTS respaldo_categoria (
  id INTEGER PRIMARY KEY NOT NULL,
  nombre TEXT NOT NULL UNIQUE
);`;

  tblRespaldoSubcategoria: string = `CREATE TABLE IF NOT EXISTS respaldo_subcategoria (
  id INTEGER PRIMARY KEY NOT NULL,
  nombre TEXT NOT NULL,
  categoria_id INTEGER NOT NULL
);`;

  tblRespaldoUsuario: string = `CREATE TABLE IF NOT EXISTS respaldo_usuario (
  id INTEGER PRIMARY KEY NOT NULL,
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
  tipo_usuario_id INTEGER NOT NULL
);`;

  tblRespaldoProducto: string = `CREATE TABLE IF NOT EXISTS respaldo_producto (
  id INTEGER PRIMARY KEY NOT NULL,
  proveedor_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio INTEGER NOT NULL,
  stock INTEGER NOT NULL,
  organico INTEGER NOT NULL CHECK(organico IN (0, 1)),
  foto_producto TEXT,
  subcategoria_id INTEGER NOT NULL,
  fecha_agregado TEXT DEFAULT(datetime('now'))
);`;

  tblRespaldoDirecciones: string = `CREATE TABLE IF NOT EXISTS respaldo_direccion(
  id INTEGER NOT NULL,  -- ID como parte de la llave compuesta
  usuario_id INTEGER NOT NULL,
  comuna_id INTEGER NOT NULL,
  direccion TEXT NOT NULL,
  PRIMARY KEY (id, usuario_id)  -- Llave compuesta
);`;

  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.createBD();
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  dbState() {
    return this.isDBReady.asObservable();
  }

  //Funciones tablas se activa al ingresar al login (Faltan algunas y por corregir)
  createBD() {
    //varificar si la plataforma esta disponible
    this.platform.ready().then(() => {
      //crear la Base de Datos
      this.sqlite
        .create({
          name: 'cutucoxx13.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          //capturar la conexion a la BD
          this.database = db;
          //llamamos a la función para crear las tablas
          this.crearTablas();
        })
        .catch((e) => {
          this.presentAlert(
            'Base de Datos',
            'Error en crear la BD: ' + JSON.stringify(e)
          );
        });
    });
  }

  async crearTablas() {
    try {
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

      //creacion de las tablas de respaldo
      await this.database.executeSql(this.tblRespaldoCategoria, []);
      await this.database.executeSql(this.tblRespaldoSubcategoria, []);
      await this.database.executeSql(this.tblRespaldoUsuario, []);
      await this.database.executeSql(this.tblRespaldoProducto, []);
      await this.database.executeSql(this.tblRespaldoDirecciones, []);

      //ejecuto los insert por defecto en el caso que existan
      await this.database.executeSql(this.registroCategoria, []);
      await this.seleccionarCategorias();
      await this.database.executeSql(this.registroSubcategoria, []);
      await this.seleccionarSubCategorias();
      await this.database.executeSql(this.registroTipoUsuario, []);
      await this.seleccionarCmbTipUsuario();

      await this.database.executeSql(this.registroRegion, []);
      await this.seleccionarCmbRegiones();

      await this.database.executeSql(this.registroComuna, []);

      await this.database.executeSql(this.registroUsuario, []);
      await this.seleccionarUsuarios();
      await this.seleccionarCbmProveedores();

      await this.database.executeSql(this.registroDireccion, [])

      await this.database.executeSql(this.registroProducto, []);
      await this.seleccionarProductos();

      await this.eliminarDatosIniciales(); //y ahora como se modifican deben actualizarse todos los observables afectados
      await this.seleccionarUsuarios();
      await this.seleccionarCbmProveedores();
      await this.seleccionarCategorias();
      await this.seleccionarSubCategorias();
      await this.seleccionarProductos();

      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert(
        'Creación de Tablas',
        'Error en crear las tablas: ' + JSON.stringify(e)
      );
    }
  }

  async eliminarDatosIniciales() {
    try {
      // Eliminar categorías iniciales
      const categoriasIniciales = await this.database.executeSql(
        'SELECT * FROM categoria',
        []
      );
      for (let i = 0; i < categoriasIniciales.rows.length; i++) {
        const categoria = categoriasIniciales.rows.item(i);
        const res = await this.database.executeSql(
          'SELECT COUNT(*) as count FROM respaldo_categoria WHERE id = ?',
          [categoria.id]
        );
        const count = res.rows.item(0).count;

        if (count > 0) {
          await this.database.executeSql('DELETE FROM categoria WHERE id = ?', [
            categoria.id,
          ]);
        }
      }

      // Eliminar subcategorías iniciales
      const subcategoriasIniciales = await this.database.executeSql(
        'SELECT * FROM subcategoria',
        []
      );
      for (let i = 0; i < subcategoriasIniciales.rows.length; i++) {
        const subcategoria = subcategoriasIniciales.rows.item(i);
        const res = await this.database.executeSql(
          'SELECT COUNT(*) as count FROM respaldo_subcategoria WHERE id = ?',
          [subcategoria.id]
        );
        const count = res.rows.item(0).count;

        if (count > 0) {
          await this.database.executeSql(
            'DELETE FROM subcategoria WHERE id = ?',
            [subcategoria.id]
          );
        }
      }

      // Eliminar productos iniciales
      const productosIniciales = await this.database.executeSql(
        'SELECT * FROM producto',
        []
      );
      for (let i = 0; i < productosIniciales.rows.length; i++) {
        const producto = productosIniciales.rows.item(i);
        const res = await this.database.executeSql(
          'SELECT COUNT(*) as count FROM respaldo_producto WHERE id = ?',
          [producto.id]
        );
        const count = res.rows.item(0).count;

        if (count > 0) {
          await this.database.executeSql('DELETE FROM producto WHERE id = ?', [
            producto.id,
          ]);
        }
      }

      // Eliminar usuarios iniciales
      const usuariosIniciales = await this.database.executeSql(
        'SELECT * FROM usuario',
        []
      );
      for (let i = 0; i < usuariosIniciales.rows.length; i++) {
        const usuario = usuariosIniciales.rows.item(i);
        const res = await this.database.executeSql(
          'SELECT COUNT(*) as count FROM respaldo_usuario WHERE id = ?',
          [usuario.id]
        );
        const count = res.rows.item(0).count;

        if (count > 0) {
          await this.database.executeSql('DELETE FROM usuario WHERE id = ?', [
            usuario.id,
          ]);
        }
      }
      // Eliminar direcciones iniciales
      const direccionesIniciales = await this.database.executeSql(
        'SELECT * FROM direccion',
        []
      );
      for (let i = 0; i < direccionesIniciales.rows.length; i++) {
        const direccion = direccionesIniciales.rows.item(i);
        const res = await this.database.executeSql(
          'SELECT COUNT(*) as count FROM respaldo_direccion WHERE id = ? AND usuario_id = ?',
          [direccion.id, direccion.usuario_id]
        );
        const count = res.rows.item(0).count;

        if (count > 0) {
          await this.database.executeSql(
            'DELETE FROM direccion WHERE id = ? AND usuario_id = ?',
            [direccion.id, direccion.usuario_id]
          );
        }
      }
    } catch (e) {
      this.presentAlert(
        'Eliminar Datos Iniciales',
        'Error: ' + JSON.stringify(e)
      );
    }
  }

  //Funcion para CRUDs pendiente modulo de administración

  //variables para guardar los datos de las consultas en las tablas:
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
  fetchUsuarios(): Observable<Usuarios[]> {
    return this.listadoUsuarios.asObservable();
  }

  fetchCategorias(): Observable<Categorias[]> {
    return this.listadoCategorias.asObservable();
  }

  fetchSubCategorias(): Observable<Subcategorias[]> {
    return this.listadoSubCategorias.asObservable();
  }

  fetchProductos(): Observable<Productos[]> {
    return this.listadoProductos.asObservable();
  }

  //Declaracion de los observables para la manipulación de la data: fetch para comboboxs para transferencia de llave

  fetchCmbSubCategorias(): Observable<CmbSubcategorias[]> {
    return this.listadoCmbSubCategorias.asObservable();
  }
  fetchCmbTipUsuario(): Observable<CmbTipUsuario[]> {
    return this.listadoCmbTipUsuario.asObservable();
  }

  fetchCmbProveedores(): Observable<CmbProveedores[]> {
    return this.listadoCmbProveedores.asObservable();
  }

  fetchCmbRegiones(): Observable<CmbRegion[]> {
    return this.listadoCmbRegiones.asObservable();
  }

  fetchCmbComuna(): Observable<CmbComuna[]> {
    return this.listadoCmbComunas.asObservable();
  }

  //CRUD USUARIOS, parte administración. Todos los SELECTS
  seleccionarUsuarios() {
    return this.database
      .executeSql(
        `SELECT u.id, u.nombre, u.segundo_nombre, u.apellido_paterno, u.apellido_materno,
u.nombre ||' '|| COALESCE (u.segundo_nombre,'') ||' ' || u.apellido_paterno ||' '|| COALESCE (u.apellido_materno,'') as nombreCompleto, 
u.email, u.contrasena, u.nombre_empresa, COALESCE (u.nombre_empresa, "Sin Empresa") empresaMostrarListar,u.descripcion_corta, COALESCE(u.descripcion_corta, "Sin Empresa") as descripcionMostrarListar, 
u.foto_perfil, u.estado_cuenta, u.fecha_registro, u.tipo_usuario_id, tu.descripcion as descTipUser
FROM usuario u
JOIN tipo_usuario tu ON u.tipo_usuario_id = tu.id WHERE u.id > 1`,
        []
      )
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: Usuarios[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
              segundo_nombre: res.rows.item(i).segundo_nombre,
              apellido_paterno: res.rows.item(i).apellido_paterno,
              apellido_materno: res.rows.item(i).apellido_materno,
              nombreCompleto: res.rows.item(i).nombreCompleto,
              email: res.rows.item(i).email,
              contrasena: res.rows.item(i).contrasena,
              nombre_empresa: res.rows.item(i).nombre_empresa,
              empresaMostrarListar: res.rows.item(i).empresaMostrarListar,
              descripcion_corta: res.rows.item(i).descripcion_corta,
              descripcionMostrarListar:
                res.rows.item(i).descripcionMostrarListar,
              foto_perfil: res.rows.item(i).foto_perfil,
              estado_cuenta: res.rows.item(i).estado_cuenta,
              fecha_registro: res.rows.item(i).fecha_registro,
              tipo_usuario_id: res.rows.item(i).tipo_usuario_id,
              descTipUser: res.rows.item(i).descTipUser,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoUsuarios.next(items as any);
      });
  }

  seleccionarCategorias() {
    return this.database
      .executeSql('SELECT * FROM categoria', [])
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: Categorias[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoCategorias.next(items as any);
      });
  }

  seleccionarSubCategorias() {
    return this.database
      .executeSql(
        `SELECT sbct.id, sbct.nombre, sbct.categoria_id, ct.nombre as nombreCategoria
FROM subcategoria sbct
JOIN categoria ct  ON sbct.categoria_id = ct.id`,
        []
      )
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: Subcategorias[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
              categoria_id: res.rows.item(i).categoria_id,
              nombreCategoria: res.rows.item(i).nombreCategoria,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoSubCategorias.next(items as any);
      });
  }

  seleccionarProductos() {
    return this.database
      .executeSql(
        `SELECT 
    p.id,
    p.proveedor_id,
    p.nombre AS nombre_producto,
    p.descripcion AS descripcion_producto,
    p.precio,
    p.stock,
    p.organico,
    CASE 
        WHEN p.organico = 1 THEN 'Verdadero'
        ELSE 'Falso'
    END AS organicoEnTexto,
    p.foto_producto,
    p.subcategoria_id,
    p.fecha_agregado,
    s.nombre AS nombre_subcategoria,
    s.categoria_id AS categoria_id, -- ID de la categoría desde la subcategoría
    u.nombre_empresa AS nombre_proveedor,
    c.nombre AS nombre_categoria
FROM 
    producto p
JOIN 
    subcategoria s ON p.subcategoria_id = s.id
JOIN 
    usuario u ON p.proveedor_id = u.id
JOIN 
    categoria c ON s.categoria_id = c.id WHERE p.id > 1;`,
        []
      )
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: Productos[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              proveedor_id: res.rows.item(i).proveedor_id,
              nombre_producto: res.rows.item(i).nombre_producto,
              descripcion_producto: res.rows.item(i).descripcion_producto,
              precio: res.rows.item(i).precio,
              stock: res.rows.item(i).stock,
              organico: res.rows.item(i).organico,
              organicoEnTexto: res.rows.item(i).organicoEnTexto,
              foto_producto: res.rows.item(i).foto_producto,
              subcategoria_id: res.rows.item(i).subcategoria_id,
              fecha_agregado: res.rows.item(i).fecha_agregado,
              nombre_subcategoria: res.rows.item(i).nombre_subcategoria,
              categoria_id: res.rows.item(i).categoria_id,
              nombre_proveedor: res.rows.item(i).nombre_proveedor,
              nombre_categoria: res.rows.item(i).nombre_categoria,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoProductos.next(items as any);
      });
  }

  //creacion de las queries para los combobox

  seleccionarCbmProveedores() {
    return this.database
      .executeSql(
        'SELECT id, nombre_empresa FROM usuario WHERE nombre_empresa NOTNULL AND id > 1',
        []
      )
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: CmbProveedores[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              nombre_empresa: res.rows.item(i).nombre_empresa,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoCmbProveedores.next(items as any);
      });
  }

  seleccionarCmbSubCategorias(id: number) {
    return this.database
      .executeSql(
        'SELECT id, nombre FROM subcategoria WHERE categoria_id = ?',
        [id]
      )
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: CmbSubcategorias[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoCmbSubCategorias.next(items as any);
      });
  }

  seleccionarCmbTipUsuario() {
    return this.database
      .executeSql('SELECT * FROM tipo_usuario', [])
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: CmbTipUsuario[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              descripcion: res.rows.item(i).descripcion,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoCmbTipUsuario.next(items as any);
      });
  }

  seleccionarCmbRegiones() {
    return this.database.executeSql('SELECT * FROM region', []).then((res) => {
      //variable para almacenar el resultado de la consulta
      let items: CmbRegion[] = [];
      //valido si trae al menos un registro
      if (res.rows.length > 0) {
        //recorro mi resultado
        for (var i = 0; i < res.rows.length; i++) {
          //agrego los registros a mi lista
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
          });
        }
      }
      //actualizar el observable de usuarios
      this.listadoCmbRegiones.next(items as any);
    });
  }

  seleccionarCmbComunas(id: number) {
    return this.database
      .executeSql('SELECT id, nombre FROM comuna WHERE region_id = ?', [id])
      .then((res) => {
        //variable para almacenar el resultado de la consulta
        let items: CmbComuna[] = [];
        //valido si trae al menos un registro
        if (res.rows.length > 0) {
          //recorro mi resultado
          for (var i = 0; i < res.rows.length; i++) {
            //agrego los registros a mi lista
            items.push({
              id: res.rows.item(i).id,
              nombre: res.rows.item(i).nombre,
            });
          }
        }
        //actualizar el observable de usuarios
        this.listadoCmbComunas.next(items as any);
      });
  }

  //todos los modificares

  modificarUsuario(
    id: number,
    nombre: string,
    segundo_nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    email: string,
    nombre_empresa: string,
    descripcion_corta: string,
    foto_perfil: string,
    estado_cuenta: string,
    tipo_usuario_id: number
  ) {
    return this.database
      .executeSql(
        'UPDATE usuario SET nombre = ?, segundo_nombre = ?, apellido_paterno = ?, apellido_materno = ?, email = ?, nombre_empresa = ?, descripcion_corta = ?, foto_perfil = ?, estado_cuenta = ?, tipo_usuario_id = ?  WHERE id = ?',
        [
          nombre,
          segundo_nombre,
          apellido_paterno,
          apellido_materno,
          email,
          nombre_empresa,
          descripcion_corta,
          foto_perfil,
          estado_cuenta,
          tipo_usuario_id,
          id,
        ]
      )
      .then((res) => {
        this.presentAlert('Modificar', 'Usuario Modificado');
        this.seleccionarUsuarios(); //actualizar en su seccion en sí
        this.seleccionarCbmProveedores();
        this.seleccionarProductos();
      })
      .catch((e) => {
        this.presentAlert('Modificar Usuario', 'Error: ' + JSON.stringify(e));
      });
  }

  modificarCategoria(id: number, nombre: string) {
    return this.database
      .executeSql('UPDATE categoria SET nombre = ? WHERE id = ?', [nombre, id])
      .then((res) => {
        this.presentAlert('Modificar', 'Categoría Modificada');
        this.seleccionarCategorias(); //actualizar en su seccion en sí
        this.seleccionarSubCategorias();
      })
      .catch((e) => {
        this.presentAlert('Modificar Categoría', 'Error: ' + JSON.stringify(e));
      });
  }

  modificarSubCategoria(id: number, nombre: string, categoria_id: number) {
    return this.database
      .executeSql(
        'UPDATE subcategoria SET nombre = ?, categoria_id = ? WHERE id = ?',
        [nombre, categoria_id, id]
      )
      .then((res) => {
        this.presentAlert('Modificar', 'SubCategoría Modificada');
        this.seleccionarSubCategorias(); //actualizar en su seccion en sí
        this.seleccionarProductos(); //actualizar en su seccion donde tiene dependencias
      })
      .catch((e) => {
        this.presentAlert(
          'Modificar SubCategoría',
          'Error: ' + JSON.stringify(e)
        );
      });
  }

  modificarProducto(
    id: number,
    proveedor_id: number,
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number,
    organico: number,
    foto_producto: string,
    subcategoria_id: number
  ) {
    return this.database
      .executeSql(
        'UPDATE producto SET proveedor_id = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, organico = ?, foto_producto = ?, subcategoria_id = ? WHERE id = ?',
        [
          proveedor_id,
          nombre,
          descripcion,
          precio,
          stock,
          organico,
          foto_producto,
          subcategoria_id,
          id,
        ]
      )
      .then((res) => {
        this.presentAlert('Modificar', 'Producto Modificado');
        this.seleccionarProductos(); //actualizar en su seccion en sí
      })
      .catch((e) => {
        this.presentAlert('Modificar Producto', 'Error: ' + JSON.stringify(e));
      });
  }

  //todos los inserts.

  insertarUsuario(
    nombre: string,
    segundo_nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    email: string,
    contrasena: string,
    nombre_empresa: string,
    descripcion_corta: string,
    foto_perfil: string,
    estado_cuenta: string,
    tipo_usuario_id: number,
    comuna_id: number,
    direccion: string
  ) {
    return this.database
      .executeSql(
        'INSERT INTO usuario(nombre, segundo_nombre, apellido_paterno, apellido_materno, email, contrasena, nombre_empresa, descripcion_corta, foto_perfil, estado_cuenta, tipo_usuario_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [
          nombre,
          segundo_nombre,
          apellido_paterno,
          apellido_materno,
          email,
          contrasena,
          nombre_empresa,
          descripcion_corta,
          foto_perfil,
          estado_cuenta,
          tipo_usuario_id,
        ]
      )
      .then((res) => {
        const usuarioId = res.insertId; // Obtener el ID del nuevo usuario

        // Ahora insertar la dirección asociada al usuario
        return this.database.executeSql(
          'INSERT INTO direccion(id, usuario_id, comuna_id, direccion) VALUES (?,?,?,?)',
          [1, usuarioId, comuna_id, direccion]
        );
      })
      .then(() => {
        this.presentAlert(
          'Insertar',
          'Usuario y dirección registrados con éxito'
        ); //despues al llegar a la parte de direcciones se hace la query, observador de direcciones no hay
        this.seleccionarUsuarios(); // Actualizar la lista de usuarios
        this.seleccionarCbmProveedores(); //actualizar el combobox de proveedores
      })
      .catch((e) => {
        this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
      });
  }

  insertarCategoria(nombre: string) {
    return this.database
      .executeSql('INSERT INTO categoria(nombre) VALUES (?)', [nombre])
      .then((res) => {
        this.presentAlert('Insertar', 'Categoría Registrada');
        this.seleccionarCategorias();
      })
      .catch((e) => {
        this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
      });
  }

  insertarSubCategoria(nombre: string, categoria_id: number) {
    return this.database
      .executeSql(
        'INSERT INTO subcategoria(nombre,categoria_id) VALUES (?,?)',
        [nombre, categoria_id]
      )
      .then((res) => {
        this.presentAlert('Insertar', 'Subcategoría Registrada');
        this.seleccionarSubCategorias();
      })
      .catch((e) => {
        this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
      });
  }

  insertarProducto(
    proveedor_id: number,
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number,
    organico: number,
    foto_producto: string,
    subcategoria_id: number
  ) {
    return this.database
      .executeSql(
        'INSERT INTO producto(proveedor_id,nombre,descripcion,precio,stock, organico, foto_producto, subcategoria_id) VALUES (?,?,?,?,?,?,?,?)',
        [
          proveedor_id,
          nombre,
          descripcion,
          precio,
          stock,
          organico,
          foto_producto,
          subcategoria_id,
        ]
      )
      .then((res) => {
        this.presentAlert('Insertar', 'Producto Registrado');
        this.seleccionarProductos();
      })
      .catch((e) => {
        this.presentAlert('Insertar', 'Error: ' + JSON.stringify(e));
      });
  }

  //================================

  //accion de eliminar de todos los cruds de la parte de administracion
  eliminarUsuario(
    id: number,
    nombre: string,
    segundo_nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    email: string,
    contrasena: string,
    nombre_empresa: string,
    descripcion_corta: string,
    foto_perfil: string,
    estado_cuenta: string,
    tipo_usuario_id: number
  ) {
    this.esRegistroProtegido('usuario', id)
      .then((esProtegido) => {
        if (esProtegido) {
          this.presentAlert(
            'Eliminar',
            'No se puede eliminar este usuario porque es un registro protegido.'
          );
        } else {
          // Actualizar registros en las tablas que dependen de usuario
          this.database
            .executeSql(
              'UPDATE producto SET proveedor_id = 1 WHERE proveedor_id = ?',
              [id]
            )
            .then(() => {
              return this.database.executeSql(
                'UPDATE direccion SET usuario_id = 1 WHERE usuario_id = ?',
                [id]
              );
            })
            .then(() => {
              return this.database.executeSql(
                'UPDATE carro_compra SET usuario_id = 1 WHERE usuario_id = ?',
                [id]
              );
            })
            .then(() => {
              // Insertar en la tabla de respaldo antes de eliminar
              return this.database.executeSql(
                'INSERT INTO respaldo_usuario(id, nombre, segundo_nombre, apellido_paterno, apellido_materno, email, contrasena, nombre_empresa, descripcion_corta, foto_perfil, estado_cuenta, tipo_usuario_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  id,
                  nombre,
                  segundo_nombre,
                  apellido_paterno,
                  apellido_materno,
                  email,
                  contrasena,
                  nombre_empresa,
                  descripcion_corta,
                  foto_perfil,
                  estado_cuenta,
                  tipo_usuario_id,
                ]
              );
            })
            .then(() => {
              // Finalmente, eliminar el usuario
              return this.database.executeSql(
                'DELETE FROM usuario WHERE id = ?',
                [id]
              );
            })
            .then(() => {
              this.presentAlert('Eliminar', 'Usuario eliminado con éxito');
              this.seleccionarUsuarios(); // Actualizar la lista de usuarios
              this.seleccionarProductos();
              this.seleccionarCbmProveedores();
            })
            .catch((e) => {
              this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
            });
        }
      })
      .catch((e) => {
        this.presentAlert(
          'Eliminar',
          'Error al verificar el registro: ' + JSON.stringify(e)
        );
      });
  }

  eliminarCategoria(id: number, nombre: string) {
    this.esRegistroProtegido('categoria', id)
      .then((esProtegido) => {
        if (esProtegido) {
          this.presentAlert(
            'Eliminar',
            'No se puede eliminar esta categoría porque es un registro protegido.'
          );
        } else {
          // Actualizar subcategorías para establecer valor por defecto
          this.database
            .executeSql(
              'UPDATE subcategoria SET categoria_id = 1 WHERE categoria_id = ?',
              [id]
            )
            .then(() => {
              // Insertar en la tabla de respaldo antes de eliminar
              return this.database.executeSql(
                'INSERT INTO respaldo_categoria (id, nombre) VALUES (?, ?)',
                [id, nombre]
              );
            })
            .then(() => {
              // Luego, eliminar la categoría

              return this.database.executeSql(
                'DELETE FROM categoria WHERE id = ?',
                [id]
              );
            })
            .then(() => {
              this.presentAlert('Eliminar', 'Categoría eliminada con éxito');
              this.seleccionarCategorias(); // Actualizar la lista de categorías
              this.seleccionarSubCategorias();
            })
            .catch((e) => {
              this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
            });
        }
      })
      .catch((e) => {
        this.presentAlert(
          'Eliminar',
          'Error al verificar el registro: ' + JSON.stringify(e)
        );
      });
  }

  eliminarSubcategoria(id: number, nombre: string, categoria_id: number) {
    this.esRegistroProtegido('subcategoria', id)
      .then((esProtegido) => {
        if (esProtegido) {
          this.presentAlert(
            'Eliminar',
            'No se puede eliminar esta subcategoría porque es un registro protegido.'
          );
        } else {
          // Actualizar registros en la tabla de productos
          this.database
            .executeSql(
              'UPDATE producto SET subcategoria_id = 1 WHERE subcategoria_id = ?',
              [id]
            )
            .then(() => {
              // Insertar en la tabla de respaldo antes de eliminar
              return this.database.executeSql(
                'INSERT INTO respaldo_subcategoria (id, nombre, categoria_id) VALUES (?, ?, ?)',
                [id, nombre, categoria_id]
              );
            })

            .then(() => {
              // Finalmente, eliminar la subcategoría
              return this.database.executeSql(
                'DELETE FROM subcategoria WHERE id = ?',
                [id]
              );
            })
            .then(() => {
              this.presentAlert('Eliminar', 'Subcategoría eliminada con éxito');
              this.seleccionarSubCategorias(); // Actualizar la lista de subcategorías
              this.seleccionarProductos();
            })
            .catch((e) => {
              this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
            });
        }
      })
      .catch((e) => {
        this.presentAlert(
          'Eliminar',
          'Error al verificar el registro: ' + JSON.stringify(e)
        );
      });
  }

  eliminarProducto(
    id: number,
    proveedor_id: number,
    nombre_producto: string,
    descripcion_producto: string,
    precio: number,
    stock: number,
    organico: number,
    foto_producto: string,
    subcategoria_id: number
  ) {
    this.esRegistroProtegido('producto', id)
      .then((esProtegido) => {
        if (esProtegido) {
          this.presentAlert(
            'Eliminar',
            'No se puede eliminar este producto porque es un registro protegido.'
          );
        } else {
          // Actualizar registros en la tabla de detalle_carro_compra
          this.database
            .executeSql(
              'UPDATE detalle_carro_compra SET producto_id = 1 WHERE producto_id = ?',
              [id]
            )
            .then(() => {
              // Insertar en la tabla de respaldo antes de eliminar
              return this.database.executeSql(
                'INSERT INTO respaldo_producto (id, proveedor_id, nombre, descripcion, precio, stock, organico, foto_producto, subcategoria_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  id,
                  proveedor_id,
                  nombre_producto,
                  descripcion_producto,
                  precio,
                  stock,
                  organico,
                  foto_producto,
                  subcategoria_id,
                ]
              );
            })

            .then(() => {
              // Finalmente, eliminar el producto
              return this.database.executeSql(
                'DELETE FROM producto WHERE id = ?',
                [id]
              );
            })

            .then(() => {
              this.presentAlert('Eliminar', 'Producto eliminado con éxito');
              this.seleccionarProductos(); // Actualizar la lista de productos
            })
            .catch((e) => {
              this.presentAlert('Eliminar', 'Error: ' + JSON.stringify(e));
            });
        }
      })
      .catch((e) => {
        this.presentAlert(
          'Eliminar',
          'Error al verificar el registro: ' + JSON.stringify(e)
        );
      });
  }

  //===============================
  //validaciones necesarios para formularios

  verificarCorreoExistente(email: string): Promise<boolean> {
    return this.database
      .executeSql('SELECT COUNT(*) AS count FROM usuario WHERE email = ?', [
        email,
      ])
      .then((res) => {
        return res.rows.item(0).count > 0; // Devuelve true si el correo ya existe   //1 es true, 0 es false
      });
  }

  esRegistroProtegido(tipo: string, id: number): Promise<boolean> {
    let query: string;
    let params: any[];

    if (tipo === 'categoria') {
      query =
        'SELECT COUNT(*) AS count FROM categoria WHERE id = ? AND nombre = "Sin Categoría"';
      params = [id];
    } else if (tipo === 'subcategoria') {
      query =
        'SELECT COUNT(*) AS count FROM subcategoria WHERE id = ? AND nombre = "Sin Subcategoría"';
      params = [id];
    } else if (tipo === 'usuario') {
      query =
        'SELECT COUNT(*) AS count FROM usuario WHERE id = ? AND nombre = "N/A"';
      params = [id];
    } else if (tipo === 'producto') {
      query =
        'SELECT COUNT(*) AS count FROM producto WHERE id = ? AND nombre = "Producto Desconocido"';
      params = [id];
    } else {
      return Promise.resolve(false); // Registro no protegido
    }

    return this.database.executeSql(query, params).then((res) => {
      return res.rows.item(0).count > 0; // Devuelve true si es un registro protegido
    });
  }

  //LOGIN
  async login(email: string, contrasena: string): Promise<any> {
    try {
      // Verificar si el email existe
      const emailResult = await this.database.executeSql(
        'SELECT * FROM usuario WHERE email = ?',
        [email]
      );

      if (emailResult.rows.length === 0) {
        // Si no se encuentra el email
        await this.presentAlert('Error', 'El email ingresado no existe.');
        return null;
      }

      // Verificar si la contraseña es correcta
      const passwordResult = await this.database.executeSql(
        'SELECT * FROM usuario WHERE email = ? AND contrasena = ?',
        [email, contrasena]
      );

      if (passwordResult.rows.length === 0) {
        // Si la contraseña es incorrecta
        await this.presentAlert('Error', 'Contraseña incorrecta.');
        return null;
      }

      // Si email y contraseña son correctos, devolver los datos del usuario
      const usuario = passwordResult.rows.item(0); // Obtener el usuario del resultado
      await this.presentAlert('¡Éxito!', `Bienvenido, ${usuario.nombre}.`);

      return usuario; // Devolver el usuario
    } catch (error) {
      console.error('Error en el login:', JSON.stringify(error));
      await this.presentAlert(
        'Error',
        'Hubo un problema al verificar las credenciales.'
      );
      return null;
    }
  }

  //RECUPERAR-PASSWORD
  // Recuperar contraseña por correo
  async recuperarcon(correo: string): Promise<any> {
    try {
      const result = await this.database.executeSql(
        'SELECT * FROM usuario WHERE email = ?',
        [correo]
      );

      if (result.rows.length === 0) {
        await this.presentAlert('Error', 'El email ingresado no existe.');
      }

      const user = result.rows.item(0);
      return user; // Retornar el usuario si se encuentra
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      throw error;
    }
  }

  // Actualizar la contraseña del usuario
  async actualizarcon(correo: string, nuevaPassword: string): Promise<void> {
    try {
      await this.database.executeSql(
        'UPDATE usuario SET contrasena = ? WHERE email = ?',
        [nuevaPassword, correo]
      );
      await this.presentAlert('¡Éxito!', `Contraseña actualizada.`);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      throw error;
    }
  }

  //REGISTER
  async Regiones(): Promise<any[]> {
    try {
      const result = await this.database.executeSql('SELECT * FROM region', []);
      const regiones = [];
      for (let i = 0; i < result.rows.length; i++) {
        regiones.push(result.rows.item(i));
      }
      return regiones;
    } catch (error) {
      console.error('Error al obtener las regiones:', error);
      return [];
    }
  }

  async Comunas(regionId: number): Promise<any[]> {
    try {
      const result = await this.database.executeSql(
        'SELECT * FROM comuna WHERE region_id = ?',
        [regionId]
      );
      const comunas = [];
      for (let i = 0; i < result.rows.length; i++) {
        comunas.push(result.rows.item(i));
      }
      return comunas;
    } catch (error) {
      console.error('Error al obtener las comunas:', error);
      return [];
    }
  }

  async registrarUsuario(usuario: any): Promise<boolean> {
    try {
      const sqlUsuario = `
        INSERT INTO usuario(
          nombre, segundo_nombre, apellido_paterno, apellido_materno, 
          email, contrasena, nombre_empresa, descripcion_corta, 
          foto_perfil, estado_cuenta, tipo_usuario_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activa', 1)`;

      const result = await this.database.executeSql(sqlUsuario, [
        usuario.nombre,
        usuario.segundo_nombre || null,
        usuario.apellido_paterno,
        usuario.apellido_materno || null,
        usuario.email,
        usuario.contrasena,
        usuario.nombre_empresa || null,
        usuario.descripcion_corta || null,
        usuario.foto_perfil || null,
      ]);

      const usuarioId = result.insertId; // Obtener el ID del usuario recién insertado

      // Query para insertar dirección asociada al usuario
      const sqlDireccion = `
        INSERT INTO direccion(id, usuario_id, comuna_id, direccion) 
        VALUES (?, ?, ?, ?)`;

      await this.database.executeSql(sqlDireccion, [
        1,
        usuarioId,
        usuario.comuna_id,
        usuario.direccion,
      ]);

      // Mostrar alerta de éxito
      this.presentAlert(
        'Insertar',
        'Usuario y dirección registrados con éxito'
      );

      // Actualizar la lista de usuarios y proveedores
      this.seleccionarUsuarios();
      this.seleccionarCbmProveedores();

      return true; // Retorna true si todo se insertó correctamente
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.presentAlert('Insertar', 'Error: ' + JSON.stringify(error));
      return false; // Retorna false en caso de error
    }
  }

  //INICIO
  // Obtener todos los usuarios vendedores
  public async getVendedores(): Promise<any[]> {
    try {
      const result = await this.database.executeSql(
        `SELECT * FROM usuario WHERE tipo_usuario_id = 2;`,
        []
      );

      const vendedores = [];
      for (let i = 0; i < result.rows.length; i++) {
        vendedores.push(result.rows.item(i));
      }

      console.log('Vendedores obtenidos:', vendedores);
      return vendedores;
    } catch (error) {
      console.error('Error al obtener los vendedores:', error);
      return [];
    }
  }



  async getProductosPorProveedor(proveedorId: number): Promise<any[]> {
    const query = `
      SELECT * FROM producto WHERE proveedor_id = ?;
    `;
    const result = await this.database.executeSql(query, [proveedorId]);
    const productos = [];
    for (let i = 0; i < result.rows.length; i++) {
      productos.push(result.rows.item(i));
    }
    return productos;
  }


  //PRODUCTOS
  // Función para obtener todos los productos disponibles
  async getProductosPorRegion(regionId: number): Promise<any[]> {
    const query = `
      SELECT p.*
      FROM producto p
      JOIN usuario u ON p.proveedor_id = u.id
      JOIN comuna c ON u.comuna_id = c.id
      JOIN region r ON c.region_id = r.id
      WHERE r.id = ?
    `;
    const productos = await this.database.executeSql(query, [regionId]);
    let items: any[] = [];
    for (let i = 0; i < productos.rows.length; i++) {
      items.push(productos.rows.item(i));
    }
    return items;
  }

  async getAllProductos() {
    const res = await this.database.executeSql('SELECT * FROM producto', []); // Asegúrate de que el nombre de la tabla sea correcto
    const productos = [];
    for (let i = 0; i < res.rows.length; i++) {
      productos.push(res.rows.item(i));
    }
    return productos;
  }

  

  public async getProductos(): Promise<any[]> {
    try {
      const result = await this.database.executeSql(
        `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, 
                p.organico, p.foto_producto, s.nombre AS subcategoria 
         FROM producto p 
         JOIN subcategoria s ON p.subcategoria_id = s.id;`,
        []
      );

      const productos = [];
      for (let i = 0; i < result.rows.length; i++) {
        productos.push(result.rows.item(i));
      }

      console.log('Productos obtenidos:', productos);
      return productos;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  //CUENTA
  // Función para obtener información del usuario por email
  async getUsuarioByEmail(email: string) {
    try {
      const result = await this.database.executeSql(
        `SELECT u.*, 
                tu.descripcion AS tipo_usuario,
                c.nombre AS comuna, 
                r.nombre AS region 
         FROM usuario u
         JOIN tipo_usuario tu ON u.tipo_usuario_id = tu.id
         LEFT JOIN direccion d ON u.id = d.usuario_id
         LEFT JOIN comuna c ON d.comuna_id = c.id
         LEFT JOIN region r ON c.region_id = r.id
         WHERE u.email = ?`,
        [email]
      );

      if (result.rows.length > 0) {
        const usuario = result.rows.item(0);
        return usuario;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async getCarroCompra(usuarioId: number) {
    const result = await this.database.executeSql(
      'SELECT * FROM carro_compra WHERE usuario_id = ? AND estado = "creado"',
      [usuarioId]
    );
    return result.rows.item(0); // Retornar solo el carro creado.
  }

  async getDetallesCarro(carroId: number) {
    const result = await this.database.executeSql(
      'SELECT * FROM detalle_carro_compra WHERE carro_id = ?',
      [carroId]
    );
    const detalles = [];
    for (let i = 0; i < result.rows.length; i++) {
      detalles.push(result.rows.item(i));
    }
    return detalles;
  }

  // Eliminar producto usando el identificador único
  async eliminarProductoDelCarro(productoIdentificador: string, carroId: number) {
    await this.database.executeSql(
      'DELETE FROM detalle_carro_compra WHERE producto_identificador = ? AND carro_id = ?',
      [productoIdentificador, carroId]
    );
  }

  async confirmarCompra(carroId: number) {
    await this.database.executeSql(
      'UPDATE carro_compra SET estado = "pagado" WHERE id = ?',
      [carroId]
    );
  }

  async getUsuarioEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM usuario WHERE email = ?';
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [email])
        .then((res) => {
          if (res.rows.length > 0) {
            resolve({
              id: res.rows.item(0).id,
              nombre: res.rows.item(0).nombre,
              // Otros campos que necesites
            });
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          console.error('Error al obtener el usuario por email', error);
          reject(error);
        });
    });
  }

  async getProducto(productoId: number): Promise<any> {
    const result = await this.database.executeSql(
      'SELECT * FROM producto WHERE id = ?',
      [productoId]
    );
    return result.rows.item(0); // Devuelve el producto
  }

  async createCarroCompra(usuarioId: number) {
    return await this.database.executeSql(
      'INSERT INTO carro_compra (usuario_id) VALUES (?)',
      [usuarioId]
    );
  }

  // Agregar producto al carro y generar un identificador único
  async agregarProductoAlCarro(carroId: number, productoId: number, cantidad: number, subtotal: number) {
    const productoIdentificador = this.generarIdentificadorUnico(); // Generar identificador único
    await this.database.executeSql(
      'INSERT INTO detalle_carro_compra (carro_id, producto_id, cantidad, subtotal, producto_identificador) VALUES (?, ?, ?, ?, ?)',
      [carroId, productoId, cantidad, subtotal, productoIdentificador]
    );
  }

  // Generar un identificador único para cada producto
  private generarIdentificadorUnico(): string {
    return 'producto_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }

  async reducirStock(productoId: number, cantidad: number) {
    await this.database.executeSql(
      'UPDATE producto SET stock = stock - ? WHERE id = ?',
      [cantidad, productoId]
    );
  }


  //COMPRAS
  async getUsuarioPorEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM usuario WHERE email = ?';
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [email])
        .then((res) => {
          if (res.rows.length > 0) {
            resolve(res.rows.item(0));
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          console.error('Error al obtener el usuario por email', error);
          reject(error);
        });
    });
  }




  async getProductosCompradosPorUsuario(email: string): Promise<any[]> {
    // Obtener el usuario
    const usuario = await this.getUsuarioPorEmail(email);
    if (!usuario) return [];

    const usuarioId = usuario.id; // Obtener el id del usuario
    const query = `
    SELECT d.*, p.nombre, p.precio 
    FROM detalle_carro_compra d
    JOIN carro_compra c ON d.carro_id = c.id
    JOIN producto p ON d.producto_id = p.id
    WHERE c.usuario_id = ? AND c.estado = 'pagado'
  `;

    const result = await this.database.executeSql(query, [usuarioId]);
    const productos = [];
    for (let i = 0; i < result.rows.length; i++) {
      productos.push(result.rows.item(i));
    }
    return productos;
  }

  async getCarrosPorUsuario(email: string): Promise<any[]> {
    const usuario = await this.getUsuarioPorEmail(email);
    if (!usuario) return [];

    const usuarioId = usuario.id; // Obtener el id del usuario
    const query = `
    SELECT * FROM carro_compra
    WHERE usuario_id = ? 
  `;

    const result = await this.database.executeSql(query, [usuarioId]);
    const carros = [];
    for (let i = 0; i < result.rows.length; i++) {
      carros.push(result.rows.item(i));
    }
    return carros;
  }



  // MOD-USUARIO
  async actualizarUsuarioPorEmail(usuario: any): Promise<boolean> {
    try {
      // Actualiza la información del usuario
      const sql = `
      UPDATE usuario
      SET 
        nombre = ?, 
        segundo_nombre = ?, 
        apellido_paterno = ?, 
        apellido_materno = ?, 
        nombre_empresa = ?, 
        descripcion_corta = ?, 
        foto_perfil = ?,  
        estado_cuenta = ?, 
        tipo_usuario_id = ?
      WHERE email = ?`; // No se cambia el email

      const result = await this.database.executeSql(sql, [
        usuario.nombre,
        usuario.segundo_nombre || null,
        usuario.apellido_paterno,
        usuario.apellido_materno || null,
        usuario.nombre_empresa || null,
        usuario.descripcion_corta || null,
        usuario.foto_perfil || null,
        usuario.estado_cuenta,
        usuario.tipo_usuario_id,
        usuario.email // Se utiliza el email para identificar al usuario
      ]);

      if (result.rowsAffected > 0) {
        // Luego de actualizar el usuario, actualizamos la dirección si se proporciona
        const usuarioId = await this.obtenerUsuarioIdPorEmail(usuario.email); // Obtener el id del usuario
        if (usuarioId) {
          return await this.actualizarDireccion(usuarioId, usuario.comuna_id, usuario.direccion);
        }
      }

      return false; // Retorna false si no se pudo actualizar
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      return false;
    }
  }

  async actualizarDireccion(usuarioId: number, comunaId: number, direccion: string): Promise<boolean> {
    try {
      const sql = `
      INSERT OR REPLACE INTO direccion (id, usuario_id, comuna_id, direccion)
      VALUES (
        (SELECT id FROM direccion WHERE usuario_id = ? LIMIT 1), 
        ?, 
        ?, 
        ?
      );`;

      const result = await this.database.executeSql(sql, [
        usuarioId, // Usamos el usuario_id para encontrar la fila
        usuarioId,
        comunaId,
        direccion
      ]);

      return result.rowsAffected > 0; // Retorna true si la actualización fue exitosa
    } catch (error) {
      console.error('Error al actualizar la dirección:', error);
      return false;
    }
  }

  async obtenerUsuarioIdPorEmail(email: string): Promise<number | null> {
    try {
      const sql = 'SELECT id FROM usuario WHERE email = ?';
      const result = await this.database.executeSql(sql, [email]);

      if (result.rows.length > 0) {
        return result.rows.item(0).id; // Retorna el ID del usuario
      }
      return null; // Si no se encontró, retorna null
    } catch (error) {
      console.error('Error al obtener usuario ID por email:', error);
      return null;
    }
  }



  async obtenerUsuarioPorEmail(email: string): Promise<any> {
    try {
      const sql = 'SELECT * FROM usuario WHERE email = ?';
      const result = await this.database.executeSql(sql, [email]);

      if (result.rows.length > 0) {
        return result.rows.item(0); // Retorna el primer usuario encontrado
      }
      return null; // Si no se encontró, retorna null
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      return null;
    }
  }



  //USUARIO
  async getUsuarioBYEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM usuario WHERE email = ?';
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [email])
        .then((res) => {
          if (res.rows.length > 0) {
            resolve(res.rows.item(0));
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          console.error('Error al obtener el usuario por email', error);
          reject(error);
        });
    });
  }


  async getProductosVendidosPorVendedor(emailVendedor: string): Promise<any[]> {
    // Obtener el usuario (vendedor)
    const vendedor = await this.getUsuarioPorEmail(emailVendedor);
    if (!vendedor) return [];

    const vendedorId = vendedor.id;
    const query = `
    SELECT vp.*, p.nombre, p.precio, u.email as compradorEmail 
    FROM ventas_productos vp
    JOIN producto p ON vp.producto_id = p.id
    JOIN usuario u ON vp.comprador_id = u.id
    WHERE vp.vendedor_id = ? AND vp.estado = 'vendido'
  `;

    const result = await this.database.executeSql(query, [vendedorId]);
    const productosVendidos = [];
    for (let i = 0; i < result.rows.length; i++) {
      productosVendidos.push(result.rows.item(i));
    }
    return productosVendidos;
  }

  //PROVENTAS

  // Método para eliminar un producto por ID
  async eliminarPro(id: number): Promise<void> {
    try {
      await this.database.executeSql('DELETE FROM producto WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;  // Lanza el error para manejarlo más adelante
    }
  }

  // Obtener usuario por email
  async getUserEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM usuario WHERE email = ?';
    try {
      const result = await this.database.executeSql(query, [email]);
      return result.rows.length > 0 ? result.rows.item(0) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Obtener productos por proveedor_id
  async getProductosProveedor(proveedorId: number): Promise<any[]> {
    const query = 'SELECT * FROM producto WHERE proveedor_id = ?';
    try {
      const result = await this.database.executeSql(query, [proveedorId]);
      const productos = [];
      for (let i = 0; i < result.rows.length; i++) {
        productos.push(result.rows.item(i));
      }
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }



  //ADD-PROVENTAS

  async obtenerCategorias(): Promise<any[]> {
    const query = `SELECT * FROM categoria`;

    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [])
        .then((data) => {
          let categorias: any[] = [];
          for (let i = 0; i < data.rows.length; i++) {
            categorias.push(data.rows.item(i));
          }
          resolve(categorias);
        })
        .catch((error) => {
          console.error('Error al obtener categorías', error);
          reject(error);
        });
    });
  }

  async obtenerSubcategoriasPorCategoria(categoriaId: number): Promise<any[]> {
    const query = `SELECT * FROM subcategoria WHERE categoria_id = ?`;

    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [categoriaId])
        .then((data) => {
          let subcategorias: any[] = [];
          for (let i = 0; i < data.rows.length; i++) {
            subcategorias.push(data.rows.item(i));
          }
          resolve(subcategorias);
        })
        .catch((error) => {
          console.error('Error al obtener subcategorías', error);
          reject(error);
        });
    });
  }

  async agregarProducto(proveedorId: number, nombre: string, descripcion: string, precio: number, stock: number, organico: number, subcategoriaId: number, foto_producto: string): Promise<void> {
    const query = `
    INSERT INTO producto (proveedor_id, nombre, descripcion, precio, stock, organico, subcategoria_id, foto_producto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [proveedorId, nombre, descripcion, precio, stock, organico, subcategoriaId, foto_producto])
        .then(() => resolve())
        .catch((error) => {
          console.error('Error al agregar producto', error);
          reject(error);
        });
    });
  }


  //MOD-PROVENTAS

  async modProducto(
    productoId: number, 
    nombre: string, 
    descripcion: string, 
    precio: number, 
    stock: number, 
    organico: number, 
    subcategoriaId: number, 
    foto_producto: string
  ): Promise<void> {
    const query = `
      UPDATE producto 
      SET nombre = ?, descripcion = ?, precio = ?, stock = ?, organico = ?, subcategoria_id = ?, foto_producto = ?
      WHERE id = ?
    `;
  
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [nombre, descripcion, precio, stock, organico, subcategoriaId, foto_producto, productoId])
        .then(() => resolve())
        .catch((error) => {
          console.error('Error al modificar producto', error);
          reject(error);
        });
    });
  }

  async obtenerProducto(productoId: number): Promise<any> {
    const query = `SELECT * FROM producto WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [productoId])
        .then((data) => {
          if (data.rows.length > 0) {
            resolve(data.rows.item(0)); // Devuelve el primer producto encontrado
          } else {
            reject('Producto no encontrado');
          }
        })
        .catch((error) => {
          console.error('Error al obtener el producto', error);
          reject(error);
        });
    });
  }


  //VIEW-PROVENTAS
  // Obtener producto por ID
  async obtProducto(productoId: number): Promise<any> {
    const query = `SELECT * FROM producto WHERE id = ?`;

    return new Promise((resolve, reject) => {
      this.database.executeSql(query, [productoId])
        .then((data) => {
          if (data.rows.length > 0) {
            resolve(data.rows.item(0));
          } else {
            resolve(null); // No se encontró el producto
          }
        })
        .catch((error) => {
          console.error('Error al obtener el producto', error);
          reject(error);
        });
    });
  }

  //REGVENTAS

 // Obtener productos vendidos por el proveedor (vendedor)
async getProductosVendidosVendedor(emailVendedor: string): Promise<any[]> {
  try {
    // Obtener el id del proveedor utilizando el email
    const usuario = await this.database.executeSql(
      'SELECT id FROM usuario WHERE email = ?',
      [emailVendedor]
    );

    if (usuario.rows.length === 0) {
      console.error('Proveedor no encontrado.');
      return [];
    }

    const proveedorId = usuario.rows.item(0).id;

    // Obtener detalles de la venta usando el proveedor_id
    const query = `
      SELECT 
        p.id AS producto_id,
        p.nombre,
        p.descripcion,
        p.foto_producto,
        p.precio,
        dc.cantidad, 
        dc.subtotal, 
        cc.fecha_creacion, 
        cc.estado, 
        cc.total,
        (SELECT email FROM usuario WHERE id = cc.usuario_id) AS compradorEmail
      FROM 
        detalle_carro_compra dc
      JOIN 
        producto p ON dc.producto_id = p.id
      JOIN 
        carro_compra cc ON dc.carro_id = cc.id
      WHERE 
        p.proveedor_id = ?;
    `;

    const result = await this.database.executeSql(query, [proveedorId]);
    const productosVendidos = [];
    for (let i = 0; i < result.rows.length; i++) {
      productosVendidos.push(result.rows.item(i));
    }

    return productosVendidos;
  } catch (error) {
    console.error('Error al obtener productos vendidos por vendedor:', error);
    throw error;
  }
}


  //MOD-CUENTA
  // Obtener todas las direcciones de un usuario por su ID
  async obtenerDireccionesPorUsuario(usuario_id: number): Promise<any[]> {
    const query = `SELECT * FROM direccion WHERE usuario_id = ?;`;
    try {
      const res = await this.database.executeSql(query, [usuario_id]);
      const direcciones = [];
      for (let i = 0; i < res.rows.length; i++) {
        direcciones.push(res.rows.item(i));
      }
      return direcciones;
    } catch (error) {
      console.error('Error al obtener direcciones:', error);
      return [];
    }
  }
  async agregarDireccion(usuario_id: number, comuna_id: number, direccion: string) {
    // Obtenemos el siguiente ID, puedes ajustar esto si tienes otro método para manejar IDs
    const queryID = `SELECT MAX(id) as maxId FROM direccion WHERE usuario_id = ?;`;
    try {
      const result = await this.database.executeSql(queryID, [usuario_id]);
      const maxId = result.rows.item(0).maxId || 0; // Si no hay IDs, comenzamos desde 0
      const nuevoId = maxId + 1; // Incrementar para nuevo ID
  
      const query = `INSERT INTO direccion (id, usuario_id, comuna_id, direccion, preferida) VALUES (?, ?, ?, ?, 0);`;
      await this.database.executeSql(query, [nuevoId, usuario_id, comuna_id, direccion]);
    } catch (error) {
      console.error('Error al agregar dirección:', error);
    }
  }

  async eliminarDireccion(id: number, usuario_id: number) {
    const query = `DELETE FROM direccion WHERE id = ? AND usuario_id = ?;`;
    try {
      await this.database.executeSql(query, [id, usuario_id]);
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
      throw error; // Opcional: lanzar el error para que el componente pueda manejarlo
    }
  }

  async establecerDireccionPreferida(id: number, usuario_id: number) {
    try {
      // Resetear preferidas a 0
      await this.database.executeSql(`UPDATE direccion SET preferida = 0 WHERE usuario_id = ?;`, [usuario_id]);
      // Establecer la nueva dirección como preferida
      await this.database.executeSql(`UPDATE direccion SET preferida = 1 WHERE id = ? AND usuario_id = ?;`, [id, usuario_id]);
    } catch (error) {
      console.error('Error al establecer la dirección preferida:', error);
    }
  }


  // Obtener el nombre de la región en base al email del usuario
  async obtenerRegionPorEmail(email: string): Promise<string | null> {
    const query = `
      SELECT r.nombre AS region
      FROM usuario u
      JOIN direccion d ON u.id = d.usuario_id
      JOIN comuna c ON d.comuna_id = c.id
      JOIN region r ON c.region_id = r.id
      WHERE u.email = ?;
    `;
  
    try {
      const result = await this.database.executeSql(query, [email]);
      if (result.rows.length > 0) {
        return result.rows.item(0).region;
      } else {
        console.warn('No se encontró región para el usuario con email:', email);
        return 'Región no encontrada';
      }
    } catch (error) {
      console.error('Error al obtener la región:', error);
      return null;
    }
  }

  async obtenerDireccionesUsuario(usuarioId: number): Promise<any[]> {
  const query = 'SELECT * FROM direccion WHERE usuario_id = ?';
  try {
    const result = await this.database.executeSql(query, [usuarioId]);
    const direcciones = [];
    for (let i = 0; i < result.rows.length; i++) {
      direcciones.push(result.rows.item(i));
    }
    return direcciones;
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    return [];
  }
}
  
async agregarDirec(usuarioId: number, comunaId: number, direccion: string) {
  const query = 'INSERT INTO direccion (usuario_id, comuna_id, direccion) VALUES (?, ?, ?)';
  try {
    await this.database.executeSql(query, [usuarioId, comunaId, direccion]);
  } catch (error) {
    console.error('Error al agregar dirección:', error);
  }
}

async actualizarUsuarioEmail(usuario: any): Promise<boolean> {
  try {
    // Actualiza la información del usuario
    const sql = `
    UPDATE usuario
    SET 
      nombre = ?, 
      segundo_nombre = ?, 
      apellido_paterno = ?, 
      apellido_materno = ?, 
      nombre_empresa = ?, 
      descripcion_corta = ?, 
      foto_perfil = ?,  
      estado_cuenta = ?, 
      tipo_usuario_id = ?
    WHERE email = ?`; // No se cambia el email

    const result = await this.database.executeSql(sql, [
      usuario.nombre,
      usuario.segundo_nombre || null,
      usuario.apellido_paterno,
      usuario.apellido_materno || null,
      usuario.nombre_empresa || null,
      usuario.descripcion_corta || null,
      usuario.foto_perfil || null,
      usuario.estado_cuenta,
      usuario.tipo_usuario_id,
      usuario.email // Se utiliza el email para identificar al usuario
    ]);

    if (result.rowsAffected > 0) {
      // Luego de actualizar el usuario, actualizamos la dirección si se proporciona
      const usuarioId = await this.obtenerUsuarioIdPorEmail(usuario.email); // Obtener el id del usuario
      if (usuarioId) {
        // Asegúrate de que los campos comuna_id y direccion están definidos en el objeto usuario
        return await this.actualizarDireccion(usuarioId, usuario.comuna_id, usuario.direccion);
      }
    }

    return false; // Retorna false si no se pudo actualizar
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return false;
  }
}

async getProductosCompradosUsuario(email: string): Promise<any[]> {
  const query = `
    SELECT 
      p.id AS producto_id,
      p.nombre,
      p.descripcion,
      p.foto_producto,
      p.precio,
      dc.cantidad, 
      dc.subtotal, 
      c.fecha_creacion, 
      c.estado, 
      c.total
    FROM 
      detalle_carro_compra dc
    JOIN 
      producto p ON dc.producto_id = p.id
    JOIN 
      carro_compra c ON dc.carro_id = c.id
    WHERE 
      c.usuario_id = (SELECT id FROM usuario WHERE email = ?);
  `;

  const result = await this.database.executeSql(query, [email]);

  let productos = [];
  for (let i = 0; i < result.rows.length; i++) {
    productos.push(result.rows.item(i));
  }
  return productos;
}

async obtenerCategoriaNombre(categoriaId: any) {
  const query = `SELECT nombre FROM categoria WHERE id = ?`;
  try {
      const resultado = await this.database.executeSql(query, [categoriaId]);
      if (resultado.rows.length > 0) {
          return resultado.rows.item(0).nombre;
      } else {
          return null; // No se encontró la categoría
      }
  } catch (error) {
      console.error('Error al obtener el nombre de la categoría:', error);
      throw error; // Propagar el error
  }
}

async obtenerSubcategoriaNombre(subcategoriaId: any) {
  const query = `SELECT nombre FROM subcategoria WHERE id = ?`;
  try {
      const resultado = await this.database.executeSql(query, [subcategoriaId]);
      if (resultado.rows.length > 0) {
          return resultado.rows.item(0).nombre;
      } else {
          return null; // No se encontró la subcategoría
      }
  } catch (error) {
      console.error('Error al obtener el nombre de la subcategoría:', error);
      throw error; // Propagar el error
  }
}


}
