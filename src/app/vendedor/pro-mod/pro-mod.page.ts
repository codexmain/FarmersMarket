import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pro-mod',
  templateUrl: './pro-mod.page.html',
  styleUrls: ['./pro-mod.page.scss'],
})
export class ProModPage implements OnInit {
  productForm!: FormGroup;
  categorias: any[] = [];
  subcategorias: any[] = [];
  categoriaSeleccionada: number | null = null;
  imagen: string | null = null;
  proveedor_id: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private databaseService: DataBaseService,
    private nativeStorage: NativeStorage,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarCategorias();
    this.cargarProducto(); // Cargar el producto seleccionado
  }

  // Inicializa el formulario con validaciones
  inicializarFormulario() {
    this.productForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      valor: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      descripcion: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(500)]],
      stock: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$'), Validators.max(99)]],
      organico: [0, Validators.required], // Cambiado a 0 para un checkbox
      subcategoria_id: ['', Validators.required],
      categoria_id: ['', Validators.required],
      foto_producto: [''],
    });
  }

  // Método para capturar la foto del producto
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      if (image && image.webPath) {
        this.imagen = image.webPath;
        this.productForm.patchValue({ foto_producto: image.webPath });
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      await this.presentAlert('Error', 'No se pudo tomar la foto.');
    }
  }

  // Cargar categorías
  async cargarCategorias() {
    try {
      this.categorias = await this.databaseService.obtenerCategorias();
      console.log('Categorías cargadas:', this.categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  // Cargar subcategorías basadas en la categoría seleccionada
  async cargarSubcategorias(event: any) {
    this.categoriaSeleccionada = event.detail.value;
    if (this.categoriaSeleccionada) {
      try {
        this.subcategorias = await this.databaseService.obtenerSubcategorias(this.categoriaSeleccionada);
        console.log('Subcategorías cargadas:', this.subcategorias);
      } catch (error) {
        console.error('Error al cargar subcategorías:', error);
      }
    } else {
      this.subcategorias = [];
      this.productForm.patchValue({ subcategoria_id: '' }); // Reiniciar subcategoría en el formulario
    }
  }

  // Cargar producto a modificar
  async cargarProducto() {
    const navigation = this.router.getCurrentNavigation();
    const producto = navigation?.extras.state?.['producto'];

    if (producto) {
      // Rellenar el formulario con los datos del producto
      this.productForm.patchValue({
        titulo: producto.titulo,
        valor: producto.valor,
        descripcion: producto.descripcion,
        stock: producto.stock,
        organico: producto.organico,
        subcategoria_id: producto.subcategoria_id,
        categoria_id: producto.categoria_id,
        foto_producto: producto.foto_producto,
      });
      
      this.imagen = producto.foto_producto; // Mostrar la imagen existente
      
      await this.cargarSubcategorias({ detail: { value: producto.categoria_id } }); // Cargar subcategorías para la categoría del producto
    } else {
      console.error('No se pasó el producto a la página de modificación.');
      await this.presentAlert('Error', 'No se pudo cargar el producto.');
    }
  }

  // Validar los campos del formulario
  async validateFields() {
    const formValues = this.productForm.value;

    if (!formValues.titulo || formValues.titulo.length < 3 || formValues.titulo.length > 50) {
      await this.presentAlert('Error', 'El Título del producto debe tener entre 3 y 50 caracteres.');
      return false;
    }

    if (!formValues.valor || formValues.valor <= 0) {
      await this.presentAlert('Error', 'El Valor del producto debe ser un número mayor a 0.');
      return false;
    }

    if (!formValues.descripcion || formValues.descripcion.length < 15 || formValues.descripcion.length > 500) {
      await this.presentAlert('Error', 'La Descripción del producto debe tener entre 15 y 500 caracteres.');
      return false;
    }

    if (!formValues.stock || formValues.stock <= 0 || formValues.stock > 99) {
      await this.presentAlert('Error', 'El Stock debe ser un número entero entre 1 y 99.');
      return false;
    }

    if (formValues.organico === undefined) {
      await this.presentAlert('Error', 'La procedencia del producto (Orgánico/No Orgánico) es un campo obligatorio.');
      return false;
    }

    if (!formValues.subcategoria_id) {
      await this.presentAlert('Error', 'La Subcategoría es un campo obligatorio.');
      return false;
    }

    return true;
  }

   // Modificar producto
   async onSubmit() {
     const isValid = await this.validateFields();
     if (!isValid) {
       return;
     }
 
     const email = await this.nativeStorage.getItem('userEmail');
     this.proveedor_id = await this.databaseService.obtenerProveedorIdPorEmail(email);
 
     if (this.proveedor_id) {
       const productData = this.productForm.value;
       const productoId = (this.router.getCurrentNavigation()?.extras.state?.['producto'] as any).id; // Obtener ID del objeto pasado
 
       if (productoId) {
         try {
           await this.databaseService.modificarProducto(
             +productoId,
             this.proveedor_id,
             productData.titulo,
             productData.descripcion,
             productData.valor,
             productData.stock,
             productData.organico,
             productData.foto_producto,
             productData.subcategoria_id
           );
           await this.presentAlert('Éxito', 'Producto modificado correctamente.');
           this.productForm.reset();
           this.imagen = null; // Limpiar la imagen después de enviar el formulario
         } catch (error) {
           console.error('Error al modificar producto:', error);
           await this.presentAlert('Error', 'No se pudo modificar el producto.');
         }
       } else {
         await this.presentAlert('Error', 'ID del producto no encontrado.');
       }
     } else {
       await this.presentAlert('Error', 'No se pudo encontrar el proveedor.');
     }
   }
 
   // Método para mostrar una alerta
   async presentAlert(header: string, message: string) {
     const alert = await this.alertController.create({
       header,
       message,
       buttons: ['OK'],
     });
     await alert.present();
   }
}