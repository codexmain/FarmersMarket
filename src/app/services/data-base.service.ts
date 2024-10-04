import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  constructor(private sqlite: SQLite) { }

  //Funciones tablas se activa al ingresar al login (Faltan algunas y por corregir)
  crearTablas() {
    this.sqlite
      .create({
        name: 'data.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {

         // Crear tabla Tipos_Ro

        // Crear tabla de Regiones
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS region (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla region creada'))
          .catch((e) => console.log('Error creando tabla region: ' + JSON.stringify(e)));

        // Crear tabla de Comunas
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS comuna (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            region_id INTEGER NOT NULL,
            FOREIGN KEY (region_id) REFERENCES region(id)
          );`, [])
          .then(() => console.log('Tabla comuna creada'))
          .catch((e) => console.log('Error creando tabla comuna: ' + JSON.stringify(e)));

        // Crear tabla de Tipos de Usuario
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS tipo_usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcion TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla tipo_usuario creada'))
          .catch((e) => console.log('Error creando tabla tipo_usuario: ' + JSON.stringify(e)));

        // Crear tabla de Usuarios
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            segundo_nombre TEXT,
            apellido_paterno TEXT NOT NULL,
            apellido_materno TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            contrasena TEXT NOT NULL,
            nombre_empresa TEXT,
            descripcion_corta TEXT, 
            foto_perfil TEXT,
            estado_cuenta TEXT CHECK(estado_cuenta IN ('activa', 'deshabilitada')) NOT NULL,
            fecha_registro TEXT DEFAULT(datetime('now')),
            tipo_usuario_id INTEGER NOT NULL,
            FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(id)
          );`, [])
          .then(() => console.log('Tabla usuario creada'))
          .catch((e) => console.log('Error creando tabla usuario: ' + JSON.stringify(e)));

        // Crear tabla de Direcciones
        db.executeSql(
          `CREATE TABLE direccion(
            id INTEGER NOT NULL,  -- ID como parte de la llave compuesta
            usuario_id INTEGER NOT NULL,
            comuna_id INTEGER NOT NULL,
            direccion TEXT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuario(id),
            FOREIGN KEY (comuna_id) REFERENCES comuna(id),
            PRIMARY KEY (id, usuario_id)  -- Llave compuesta
          );`, [])
          .then(() => console.log('Tabla direccion creada'))
          .catch((e) => console.log('Error creando tabla direccion: ' + JSON.stringify(e)));

        // Crear tabla de Categorías
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS categoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla categoria creada'))
          .catch((e) => console.log('Error creando tabla categoria: ' + JSON.stringify(e)));

        // Crear tabla de Subcategorías
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS subcategoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            categoria_id INTEGER NOT NULL,
            FOREIGN KEY (categoria_id) REFERENCES categoria(id)
          );`, [])
          .then(() => console.log('Tabla subcategoria creada'))
          .catch((e) => console.log('Error creando tabla subcategoria: ' + JSON.stringify(e)));

        // Crear tabla de Productos
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS producto (
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
          );`, [])
          .then(() => console.log('Tabla producto creada'))
          .catch((e) => console.log('Error creando tabla producto: ' + JSON.stringify(e)));

        // Crear tabla de Carro de Compras
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS carro_compra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            fecha_creacion TEXT DEFAULT(datetime('now')),
            total INTEGER DEFAULT 0,
            estado TEXT CHECK(estado IN ('creado', 'pagado', 'cancelado')) NOT NULL DEFAULT 'creado',
            FOREIGN KEY (usuario_id) REFERENCES usuario(id)
          );`, [])
          .then(() => console.log('Tabla carro_compra creada'))
          .catch((e) => console.log('Error creando tabla carro_compra: ' + JSON.stringify(e)));

        // Crear tabla de Detalles del Carro de Compras
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS detalle_carro_compra (
            id INTEGER NOT NULL,
            carro_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad INTEGER NOT NULL,
            subtotal INTEGER NOT NULL,
            FOREIGN KEY (carro_id) REFERENCES carro_compra(id),
            FOREIGN KEY (producto_id) REFERENCES producto(id),
            PRIMARY KEY (id, carro_id)
          );`, [])
          .then(() => console.log('Tabla detalle_carro_compra creada'))
          .catch((e) => console.log('Error creando tabla detalle_carro_compra: ' + JSON.stringify(e)));


        // Insertar las categorías predefinidas (Buscar otra forma o tener que hacer lo mismo para tener usuarios ya creados)
        db.executeSql(
          `INSERT OR IGNORE INTO categoria (id,nombre) VALUES
            (1,'Sin Categoría'),
            (2,'Frutas'),
            (3,'Verduras'),
            (4,'Granos'),
            (5,'Lácteos'),
            (6,'Carnes'),
            (7,'Hierbas y Especias'),
            (8,'Cultivos y Semillas');`, [])
          .then(() => console.log('Categorías predefinidas insertadas'))
          .catch((e) => console.log('Error insertando categorías: ' + JSON.stringify(e)));


        // Insertar las subcategorías predefinidas(Por mientras ver la factibilidad de dejar datos asi en la base para tener usuarios)
        db.executeSql(
          `INSERT OR IGNORE INTO subcategoria (id,nombre,categoria_id) VALUES
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
            (38,'Otros Cultivos y Semillas',8);`, [])
          .then(() => console.log('Subcategorías predefinidas insertadas'))
          .catch((e) => console.log('Error insertando subcategorías: ' + JSON.stringify(e)));
      })
      .catch((e) => console.log('Error al crear o abrir la base de datos: ' + JSON.stringify(e)));
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

//Funcion para CRUD pendiente

}
