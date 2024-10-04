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

         // Crear tabla Tipos_Rol
         db.executeSql(
          'CREATE TABLE IF NOT EXISTS Tipos_Rol (id INTEGER PRIMARY KEY AUTOINCREMENT, descripcion TEXT NOT NULL UNIQUE);',
          []
        );

        // Crear tabla de Regiones
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Regiones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla Regiones creada'))
          .catch((e) => console.log('Error creando tabla Regiones: ' + JSON.stringify(e)));

        // Crear tabla de Comunas
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Comunas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            region_id INTEGER NOT NULL,
            FOREIGN KEY (region_id) REFERENCES Regiones(id)
          );`, [])
          .then(() => console.log('Tabla Comunas creada'))
          .catch((e) => console.log('Error creando tabla Comunas: ' + JSON.stringify(e)));

        // Crear tabla de Tipos de Usuario
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Tipos_Usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcion TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla Tipos_Usuario creada'))
          .catch((e) => console.log('Error creando tabla Tipos_Usuario: ' + JSON.stringify(e)));

        // Crear tabla de Usuarios
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            segundo_nombre TEXT,
            apellido_paterno TEXT NOT NULL,
            apellido_materno TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            contrasena TEXT NOT NULL,
            nombre_empresa TEXT,
            foto_perfil TEXT,
            estado_cuenta TEXT CHECK(estado_cuenta IN ('activa', 'deshabilitada', 'eliminada')) NOT NULL,
            fecha_registro TEXT DEFAULT(datetime('now')),
            tipo_usuario_id INTEGER NOT NULL,
            FOREIGN KEY (tipo_usuario_id) REFERENCES Tipos_Usuario(id)
          );`, [])
          .then(() => console.log('Tabla Usuarios creada'))
          .catch((e) => console.log('Error creando tabla Usuarios: ' + JSON.stringify(e)));

        // Crear tabla de Direcciones
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Direcciones (
            id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            comuna_id INTEGER NOT NULL,
            region_id INTEGER NOT NULL,
            direccion TEXT NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id),
            FOREIGN KEY (comuna_id) REFERENCES Comunas(id),
            FOREIGN KEY (region_id) REFERENCES Regiones(id)
            PRIMARY KEY (id, usuario_id)
          );`, [])
          .then(() => console.log('Tabla Direcciones creada'))
          .catch((e) => console.log('Error creando tabla Direcciones: ' + JSON.stringify(e)));

        // Crear tabla de Categorías
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla Categorias creada'))
          .catch((e) => console.log('Error creando tabla Categorias: ' + JSON.stringify(e)));

        // Crear tabla de Subcategorías
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Subcategorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            categoria_id INTEGER NOT NULL,
            FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
          );`, [])
          .then(() => console.log('Tabla Subcategorias creada'))
          .catch((e) => console.log('Error creando tabla Subcategorias: ' + JSON.stringify(e)));

        // Crear tabla de Productos
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Productos (
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
            FOREIGN KEY (proveedor_id) REFERENCES Usuarios(id),
            FOREIGN KEY (subcategoria_id) REFERENCES Subcategorias(id)
          );`, [])
          .then(() => console.log('Tabla Productos creada'))
          .catch((e) => console.log('Error creando tabla Productos: ' + JSON.stringify(e)));

        // Crear tabla de Carro de Compras
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Carro_Compras (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            fecha_creacion TEXT DEFAULT(datetime('now')),
            total INTEGER DEFAULT 0,
            estado TEXT CHECK(estado IN ('creado', 'pagado', 'cancelado')) NOT NULL DEFAULT 'creado',
            FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
          );`, [])
          .then(() => console.log('Tabla Carro_Compras creada'))
          .catch((e) => console.log('Error creando tabla Carro_Compras: ' + JSON.stringify(e)));

        // Crear tabla de Detalles del Carro de Compras
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Detalles_Carro_Compras (
            id INTEGER NOT NULL,
            carro_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad INTEGER NOT NULL,
            subtotal INTEGER NOT NULL,
            FOREIGN KEY (carro_id) REFERENCES Carro_Compras(id),
            FOREIGN KEY (producto_id) REFERENCES Productos(id),
            PRIMARY KEY (id, carro_id)
          );`, [])
          .then(() => console.log('Tabla Detalles_Carro_Compras creada'))
          .catch((e) => console.log('Error creando tabla Detalles_Carro_Compras: ' + JSON.stringify(e)));

        // Crear tabla de Categorías
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Categorias (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nombre TEXT NOT NULL UNIQUE
          );`, [])
          .then(() => console.log('Tabla Categorias creada'))
          .catch((e) => console.log('Error creando tabla Categorias: ' + JSON.stringify(e)));

        // Insertar las categorías predefinidas (Buscar otra forma o tener que hacer lo mismo para tener usuarios ya creados)
        db.executeSql(
          `INSERT OR IGNORE INTO Categorias (nombre) VALUES
              ('Frutas'),
              ('Verduras'),
              ('Granos'),
              ('Lácteos'),
              ('Carnes'),
              ('Hierbas y Especias'),
              ('Cultivos y Semillas'),
              ('Sin Categoría');`, [])
          .then(() => console.log('Categorías predefinidas insertadas'))
          .catch((e) => console.log('Error insertando categorías: ' + JSON.stringify(e)));

        // Crear tabla de Subcategorías
        db.executeSql(
          `CREATE TABLE IF NOT EXISTS Subcategorias (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nombre TEXT NOT NULL,
              categoria_id INTEGER NOT NULL,
              FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
          );`, [])
          .then(() => console.log('Tabla Subcategorias creada'))
          .catch((e) => console.log('Error creando tabla Subcategorias: ' + JSON.stringify(e)));

        // Insertar las subcategorías predefinidas(Por mientras ver la factibilidad de dejar datos asi en la base para tener usuarios)
        db.executeSql(
          `INSERT OR IGNORE INTO Subcategorias (nombre, categoria_id) VALUES
              -- Subcategorías de Frutas
              ('Manzanas', (SELECT id FROM Categorias WHERE nombre='Frutas')),
              ('Peras', (SELECT id FROM Categorias WHERE nombre='Frutas')),
              ('Plátanos', (SELECT id FROM Categorias WHERE nombre='Frutas')),
              ('Cítricos', (SELECT id FROM Categorias WHERE nombre='Frutas')),
              ('Berries', (SELECT id FROM Categorias WHERE nombre='Frutas')),
              ('Otras Frutas', (SELECT id FROM Categorias WHERE nombre='Frutas')),

              -- Subcategorías de Verduras
              ('Hortalizas de raíz', (SELECT id FROM Categorias WHERE nombre='Verduras')),
              ('Hortalizas de hoja', (SELECT id FROM Categorias WHERE nombre='Verduras')),
              ('Germinados, brotes y microgreens', (SELECT id FROM Categorias WHERE nombre='Verduras')),
              ('Otras Verduras', (SELECT id FROM Categorias WHERE nombre='Verduras')),

              -- Subcategorías de Granos
              ('Arroz', (SELECT id FROM Categorias WHERE nombre='Granos')),
              ('Quinoa', (SELECT id FROM Categorias WHERE nombre='Granos')),
              ('Frijoles', (SELECT id FROM Categorias WHERE nombre='Granos')),
              ('Lentejas', (SELECT id FROM Categorias WHERE nombre='Granos')),
              ('Otros Granos', (SELECT id FROM Categorias WHERE nombre='Granos')),

              -- Subcategorías de Lácteos
              ('Leche', (SELECT id FROM Categorias WHERE nombre='Lácteos')),
              ('Yogur', (SELECT id FROM Categorias WHERE nombre='Lácteos')),
              ('Queso', (SELECT id FROM Categorias WHERE nombre='Lácteos')),
              ('Mantequilla', (SELECT id FROM Categorias WHERE nombre='Lácteos')),
              ('Otros Lácteos', (SELECT id FROM Categorias WHERE nombre='Lácteos')),

              -- Subcategorías de Carnes
              ('Pollo', (SELECT id FROM Categorias WHERE nombre='Carnes')),
              ('Res', (SELECT id FROM Categorias WHERE nombre='Carnes')),
              ('Cerdo', (SELECT id FROM Categorias WHERE nombre='Carnes')),
              ('Pescados', (SELECT id FROM Categorias WHERE nombre='Carnes')),
              ('Otras Carnes', (SELECT id FROM Categorias WHERE nombre='Carnes')),

              -- Subcategorías de Hierbas y Especias
              ('Albahaca', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),
              ('Perejil', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),
              ('Romero', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),
              ('Canela', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),
              ('Merken', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),
              ('Cilantro', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),
              ('Otras Hierbas/Especias', (SELECT id FROM Categorias WHERE nombre='Hierbas y Especias')),

              -- Subcategorías de Cultivos y Semillas
              ('Semillas', (SELECT id FROM Categorias WHERE nombre='Cultivos y Semillas')),
              ('Tubérculos', (SELECT id FROM Categorias WHERE nombre='Cultivos y Semillas')),
              ('Semillas Heirlooms', (SELECT id FROM Categorias WHERE nombre='Cultivos y Semillas')),
              ('Rizomas', (SELECT id FROM Categorias WHERE nombre='Cultivos y Semillas')),

              -- Subcategoría de Sin Categoría
              ('Sin Subcategoría', (SELECT id FROM Categorias WHERE nombre='Sin Categoría'));`, [])
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
