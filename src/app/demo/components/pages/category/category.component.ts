import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/demo/api/category';
import { CategoryService } from 'src/app/demo/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [MessageService]
})
export class CategoryComponent implements OnInit {
  equipmentForm: FormGroup;
  categoryForm: FormGroup;
  categoryDialog: boolean = false;

  deleteCategoryDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

  categories: Category[] = [];

  product: Product = {};

  category: Category={};

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private categoryService: CategoryService,private productService: ProductService, private messageService: MessageService, private fb: FormBuilder) { }
 

  ngOnInit() {
      this.createForm();
      this.loadCategories();
  }
  testCreateCategory() {
      // Create a sample equipment object with static data
      const staticCategoryData: Category = {
        id: null, // The backend should generate a unique ID
       
        nom: 'Cat 1',
        
      };
      this.categoryService.createCategory(staticCategoryData).subscribe(
        (response) => {
          console.log('Category added successfully:', response);
        },
        (error) => {
          console.error('Error adding category:', error);
        }
      );
  }
  createForm() {
      this.categoryForm = this.fb.group({
          nom: ['', Validators.required],
      });
  }
  loadCategories() {
      this.categoryService.getCategories().subscribe(
          (data: Category[]) => {
              this.categories = data;
          },
          (error) => {
              console.error('Error fetching categories:', error);
          }
      );
  }

  onSubmit() {
      console.log('onSubmit() method called!');
      console.log(this.categoryForm.value);
      
      if (this.categoryForm.valid) {
        console.log('Form is valid. Submitting data...');
        const categoryData = this.categoryForm.value;
        console.log('Data to be sent:', categoryData);
        
        // Rest of the code for API call and handling the response...
        
      } else {
        console.log('Form is invalid. Cannot submit data.');
        // Print form control errors
        for (const controlKey in this.categoryForm.controls) {
          const control = this.categoryForm.controls[controlKey];
          if (control.invalid) {
            console.log(`Invalid control: ${controlKey}, Errors: `, control.errors);
          }
        }
      } 
      //console.log('onSubmit() method called!');
      //console.log(this.categoryForm.value);
          if (this.categoryForm.valid) {
          const categoryData = this.categoryForm.value;
          this.categoryService.createCategory(categoryData).subscribe(
              (response) => {
                  console.log('Category added successfully:', response);
                  // Reset the form after successful submission
                  this.categoryForm.reset();
                  // Refresh the list of equipments after adding a new one
                  this.loadCategories();
              },
              (error) => {
                  console.error('Error adding category:', error);
              }
          );
      }
  }
  openNew() {
      this.product = {};
      this.category={};
      this.submitted = false;
      this.categoryDialog = true;
  }
  deleteSelectedProducts() {
      this.deleteProductsDialog = true;
  }
  editProduct(product: Product) {
      this.product = { ...product };
      this.categoryDialog = true;
  }

  deleteProduct(product: Product) {
      this.deleteCategoryDialog = true;
      this.product = { ...product };
  }
  confirmDeleteSelected() {
      this.deleteProductsDialog = false;
      this.products = this.products.filter(val => !this.selectedProducts.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      this.selectedProducts = [];
  }
  confirmDelete() {
      this.deleteCategoryDialog = false;
      this.products = this.products.filter(val => val.id !== this.product.id);
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      this.product = {};
  }

  hideDialog() {
      this.categoryDialog = false;
      this.submitted = false;
  }

  saveProduct() {
      this.submitted = true;

      if (this.product.name?.trim()) {
          if (this.product.id) {
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          } else {
              this.product.id = this.createId();
              this.product.code = this.createId();
              this.product.image = 'product-placeholder.svg';
              // @ts-ignore
              this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
              this.products.push(this.product);
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          }

          this.products = [...this.products];
          this.categoryDialog = false;
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

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}





