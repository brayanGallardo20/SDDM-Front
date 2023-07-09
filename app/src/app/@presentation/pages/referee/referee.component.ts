import { Component, OnInit,  } from '@angular/core';
import { Historical } from 'src/app/@data/model/historical';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { MessageService} from 'primeng/api';

@Component({
  selector: 'centro-arbitraje-arbitros',
  templateUrl: './referee.component.html',
  styleUrls: ['./referee.component.scss',
'../shared-component-styles.scss']
})
export class RefereeComponent implements OnInit {

  productDialog: boolean;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Historical[];

  product: Historical;

  selectedProducts: Historical[];

  submitted: boolean;

  cols: any[];

  statuses: any[];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private productService: HistoricalService, private messageService: MessageService) {
  }

  ngOnInit() {
      this.productService.getProducts().then(data => this.products = data);

      this.cols = [
          {field: 'name', header: 'Name'},
          {field: 'price', header: 'Price'},
          {field: 'category', header: 'Category'},
          {field: 'rating', header: 'Reviews'},
          {field: 'inventoryStatus', header: 'Status'}
      ];

      this.statuses = [
          {label: 'INSTOCK', value: 'instock'},
          {label: 'LOWSTOCK', value: 'lowstock'},
          {label: 'OUTOFSTOCK', value: 'outofstock'}
      ];
  }

  openNew() {
      this.product = {};
      this.submitted = false;
      this.productDialog = true;
  }

  deleteSelectedProducts() {
      this.deleteProductsDialog = true;
  }

  editProduct(product: Historical) {
      this.product = {...product};
      this.productDialog = true;
  }

  deleteProduct(product: Historical) {
      this.deleteProductDialog = true;
      this.product = {...product};
  }

  confirmDeleteSelected(){
      this.deleteProductsDialog = false;
      this.products = this.products.filter(val => !this.selectedProducts.includes(val));
      this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
      this.selectedProducts = null;
  }

  confirmDelete(){
      this.deleteProductDialog = false;
      this.products = this.products.filter(val => val.id !== this.product.id);
      this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
      this.product = {};
  }

  hideDialog() {
      this.productDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;

      if (this.product.name.trim()) {
          if (this.product.id) {
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value: this.product.inventoryStatus;
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
          } else {
              this.product.id = this.createId();
              this.product.code = this.createId();
              this.product.image = 'product-placeholder.svg';
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
              this.products.push(this.product);
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

}
