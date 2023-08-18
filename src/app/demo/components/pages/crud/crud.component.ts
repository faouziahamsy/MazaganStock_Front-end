import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { Category } from 'src/app/demo/api/category';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { CategoryService } from 'src/app/demo/service/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Papa from 'papaparse';


enum EtatEnum {
  INSTOCK = 'INSTOCK',
  LOWSTOCK = 'LOWSTOCK',
  OUTOFSTOCK = 'OUTOFSTOCK',
}

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {


    equipmentForm: FormGroup;

    selectedImage: File;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    equipment: Product={};

    categories: Category[] =[];

    selectedCategory: Category;

    selectedProducts: Product[] = [];
    
    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    etatValues: string[] = Object.values(EtatEnum);

    selectedEtat: EtatEnum;
    quantityValue: number;

    isEditMode: boolean = false;
  
    
    constructor(  private productService: ProductService, 
                  private categoryService: CategoryService, 
                  private messageService: MessageService, 
                  private fb: FormBuilder) 
                  { }
   
  
    ngOnInit() {
        this.createForm();
        this.loadCategories();
        this.loadEquipments();  
        this.product.matricule = '';
    }

    createForm() {
        this.equipmentForm = this.fb.group({
            matricule: ['',Validators.required],
            quantity: ['',Validators.required],
            category:[''],
            dateEntree:[''],
            dateSortie:[''],
            etat:['']
        });
       // console.log(this.equipmentForm);
    }

getCategoryNom(categoryId: number): string {
  const category = this.categories.find((cat) => cat.id === categoryId);
  return category ? category.nom : '';
}
    loadCategories() {
      this.categoryService.getCategories().subscribe(
        (data: Category[]) => {
          this.categories = data;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
    }
    loadEquipments() {
        this.productService.getEquipments().subscribe(
            (data: Product[]) => {
                this.products = data;
            },
            (error) => {
                console.error('Error fetching equipments:', error);
            }
        );
    }

  onSubmit() {
    const equipmentData: Product = {
      matricule: this.product.matricule.toString(),
      categoryId: this.product.category.id,
      quantity: this.product.quantity,
      dateEntree: this.product.dateEntree,
      dateSortie: this.product.dateSortie,
      etat: this.product.etat,
    };
   // console.log(equipmentData);
    this.productService.saveEquipment(equipmentData).subscribe(
      (response) => {
        const newProduct: Product = {...response}
        // const newProduct: Product = {...response} {id: response.id, name: response.name}
        this.products.push(newProduct)
        
        console.log('Equipment saved successfully!', response);
      },
      (error) => {
        
        console.error('Error while saving equipment:', error);
      }
    );
    this.productDialog = false;
  }
  onUpdateEquipment() {
    const product : Product = {
      matricule: this.product.matricule.toString(),
      categoryId: this.selectedCategory.id,
      quantity: this.quantityValue,
      dateEntree: this.equipmentForm.value.dateEntree,
      dateSortie: this.equipmentForm.value.dateSortie,
      etat: this.product.etat,
    };
    this.productDialog = false;
 // console.log(product);
  }
    openNew() {
        this.product = {};
        this.submitted = false;
        this.isEditMode = false;
        this.productDialog = true;
    }
    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }
    editProduct(product: Product) {
        this.product = { ...product };
        console.log('====================================');
        console.log(this.product);
        console.log('====================================');
        this.productDialog = true;
        this.isEditMode = true;
    }
    updateEquipment(product: Product) {
      const equipmentId = this.product.id;
      this.productService.updateEquipment(equipmentId, product).subscribe(
          (updatedequipment: Product) => {
              // Update the category in the list with the updated values
              const index = this.categories.findIndex(c => c.id === updatedequipment.id);
              if (index !== -1) {
                  this.products[index] = updatedequipment;
              }
              // Show a success message or perform any other necessary actions
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipment updated successfully', life: 3000 });
          },
          (error) => {
              console.error('Error updating equipment:', error);
              // Show an error message or perform error handling
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update equipment', life: 3000 });
          }   
      );
  }

  
    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipments Deleted', life: 3000 });
        this.selectedProducts = [];
    } 
    confirmDelete() {
      if (this.product.id) {
        const productId = this.product.id;
        this.productService.deleteEquipment(productId).subscribe(
          () => {
            console.log('Equipment deleted successfully:', this.product);
            // Remove the deleted category from the list
            this.products  = this.products.filter((val) => val.id !== this.product.id);
            this.deleteProductDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Equipment Deleted',
              life: 3000
            });
          },
          (error) => {
            console.error('Error deleting equipment:', error);
          }
        );
      } else {
        console.error('equipment ID is null or undefined');
      }
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getStatusClass(state: EtatEnum): string {
    switch (state) {
      case EtatEnum.INSTOCK:
        return 'status-instock';
      case EtatEnum.OUTOFSTOCK:
        return 'status-outofstock';
      case EtatEnum.LOWSTOCK:
        return 'status-lowstock';
      default:
        return '';
    }
  }
  exportToCsv(data: any[], filename: string) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  exportEquipmentToCsv() {
    this.productService.getEquipments().subscribe(equipments => {
      this.exportToCsv(equipments, 'equipments.csv');
    });
  }
  

  }
  
  
 
  

