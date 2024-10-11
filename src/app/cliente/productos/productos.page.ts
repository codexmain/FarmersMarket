import { Component, OnInit } from '@angular/core';
//PRODUCTO RANDOM
import { DataBaseService } from 'src/app/services/data-base.service';
import { Productos, ProductosService } from 'src/app/services/productos';
//SEPARAR POR
import { Categorias, CategoriasService } from 'src/app/services/categorias';
import {
  Subcategorias,
  SubcategoriasService,
} from 'src/app/services/subcategorias';
import { ModalController } from '@ionic/angular';
import { DetalleProductoComponent } from 'src/app/detalle-producto/detalle-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: Productos[] = [];
  categories: Categorias[] = [];
  subcategories: Subcategorias[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private subcategoriasService: SubcategoriasService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    /*const userRegionId =  USAR LOGICA DE GPS O LO QUE SE UTILIZA EN EL MAPA;
    this.productosService.getRandomProducts(userRegionId).subscribe((productos) => {
      this.productos = productos;
    });
    this.categoriasService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.subcategoriasService
      .getSubcategories(categoryId)
      .subscribe((subcategories) => {
        this.subcategories = subcategories;
      });
  }*/

  /*async openProductDetails(product: Productos) {
    const modal = await this.modalController.create({
        component: DetalleProductoComponent,
        componentProps: { product }
    });
    return await modal.present();
}*/
}
}
