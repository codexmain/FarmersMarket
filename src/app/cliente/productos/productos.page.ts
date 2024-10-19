import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service'; // Ruta del servicio de base de datos
import { Productos } from 'src/app/services/productos';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: Productos[] = []; // Array para almacenar todos los productos
  filteredProducts: Productos[] = []; // Array para almacenar los productos filtrados

  constructor(private databaseService: DataBaseService) {} // Inyección del servicio de base de datos

  ngOnInit() {
    this.seleccionarProductos(); // Llama a la función para obtener los productos

    // Suscribirse a la lista de productos desde el servicio
    this.databaseService.listadoProductos.subscribe((productos) => {
      this.productos = productos; // Almacena todos los productos
      this.filteredProducts = productos; // Inicialmente, muestra todos los productos
    });
  }

  // Método para obtener productos de la base de datos
  seleccionarProductos() {
    this.databaseService.seleccionarProductos(); // Llama al método de tu servicio
  }

  // Método para filtrar productos según el texto de búsqueda
  buscarProducto(event: any) {
    const query = event.target.value.toLowerCase(); // Obtén el valor de la búsqueda
    this.filteredProducts = this.productos.filter((producto) =>
      producto.nombre_producto.toLowerCase().includes(query) // Filtra por nombre del producto
    );
  }

 // Función para agregar producto al carro
 async agregarAlCarro(producto: Productos) {
  // Aquí obtén el carro_id, puedes almacenarlo en el almacenamiento local o en un servicio.
  const carro_id = 1; // Cambia esto según la lógica de tu aplicación.

  // Calcula el subtotal
  const subtotal = producto.precio; // O el cálculo que necesites para el subtotal.

  // Llama al servicio para agregar el producto al detalle del carro
  await this.databaseService.agregarProductoAlCarro(carro_id, producto.id, 1, subtotal);

  // Opcional: Puedes mostrar un mensaje de éxito
  console.log('Producto agregado al carro:', producto.nombre_producto);
}
}