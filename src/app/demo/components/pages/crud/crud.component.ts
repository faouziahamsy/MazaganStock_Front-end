import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {
    equipmentForm: FormGroup;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    
    constructor(private productService: ProductService, private messageService: MessageService, private fb: FormBuilder) { }
   
  
    ngOnInit() {
        this.createForm();
        this.loadEquipments();
    }
    testCreateEquipment() {
        // Create a sample equipment object with static data
        const staticEquipmentData: Product = {
          id: null, // The backend should generate a unique ID
          matricule: 'FF',
          name: 'Sample Equipment',
          description: 'This is a sample equipment.',
          quantity: 10,
          image: 'sample-image.jpg',
          // Add other properties as needed based on your Product model
        };
        this.productService.createEquipment(staticEquipmentData).subscribe(
          (response) => {
            console.log('Equipment added successfully:', response);
          },
          (error) => {
            console.error('Error adding equipment:', error);
          }
        );
    }
    createForm() {
        this.equipmentForm = this.fb.group({
            matricule: ['', Validators.required],
            quantity: [, Validators.min(0)],
            image: [''],
        });
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
        console.log('onSubmit() method called!');
        console.log(this.equipmentForm.value);
        
        if (this.equipmentForm.valid) {
          console.log('Form is valid. Submitting data...');
          const equipmentData = this.equipmentForm.value;
          console.log('Data to be sent:', equipmentData);
          
          // Rest of the code for API call and handling the response...
          
        } else {
          console.log('Form is invalid. Cannot submit data.');
          // Print form control errors
          for (const controlKey in this.equipmentForm.controls) {
            const control = this.equipmentForm.controls[controlKey];
            if (control.invalid) {
              console.log(`Invalid control: ${controlKey}, Errors: `, control.errors);
            }
          }
        } 
        //console.log('onSubmit() method called!');
        //console.log(this.equipmentForm.value);
            if (this.equipmentForm.valid) {
            const equipmentData = this.equipmentForm.value;
            this.productService.createEquipment(equipmentData).subscribe(
                (response) => {
                    console.log('Equipment added successfully:', response);
                    // Reset the form after successful submission
                    this.equipmentForm.reset();
                    // Refresh the list of equipments after adding a new one
                    this.loadEquipments();
                },
                (error) => {
                    console.error('Error adding equipment:', error);
                }
            );
        }
    }
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }
    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }
    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }
    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
