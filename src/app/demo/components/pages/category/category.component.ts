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
  valueTest: String ;
  deleteCategoryDialog: boolean = false;
  deleteCategoriesDialog: boolean = false;
  categories: Category[] = []; 
  category: Category={};
  selectedCategories: Category[] = [];

  submitted: boolean = false;
  isEditMode: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];
  formData: any = {};
 
  rowsPerPageOptions = [5, 10, 20];

  constructor(private categoryService: CategoryService,private productService: ProductService, private messageService: MessageService, private fb: FormBuilder) { }
 
  ngOnInit() {
      this.createForm();
      this.loadCategories();
  }

 
 
  showDeleteDialog(category: any) {
    this.category = category;
    this.deleteCategoryDialog = true;
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
 
// save category
//   onSubmit() {
//     const category = {
//         "nom":this.valueTest.toString(), 
//     }
//     this.categoryService.createCategory(category).subscribe(
//         (response) => {
//           console.log('Category added successfully:', response);
//         },
//         (error) => {
//           console.error('Error adding category:', error);
//         }
//       );
//   }
  onSubmit() {
    const category = {
      "nom": this.valueTest.toString(),
    };
  
    this.categoryService.createCategory(category).subscribe(
      (response) => {
        console.log('Category added successfully:', response);
        this.loadCategories(); // Reload the categories after adding a new one
        this.hideDialog();
      },
      (error) => {
        console.error('Error adding category:', error);
      }
    );
  }
  onUpdateCategory() {
    const category: {
        id: number;
        nom: string;
    } = {
        id: this.category.id, // Convert the ID to a number
        nom: this.valueTest.toString(),
    };
    console.log(this.category.id,this.valueTest);
  
    this.categoryService.updateCategory(category.id, category).subscribe(
      (response) => {
        console.log('Category updated successfully:', response);
        this.loadCategories(); // Reload the categories after updating
        this.hideDialog();
      },
      (error) => {
        console.error('Error updating category:', error);
      }
    );
  }
  

  openNew() {
    this.category = {};
    this.isEditMode = false;
    this.submitted = false;
    this.categoryDialog = true;
  }
 
  deleteSelectedCategories() {
      this.deleteCategoriesDialog = true;
  }
  editCategory(category: Category) {
    this.category = { ...category };
    this.isEditMode = true;
    this.categoryDialog = true;
  }

  deleteCategory(category: Category) {
      this.deleteCategoryDialog = true;
      this.category = { ...category };
  }
  confirmDeleteSelected() {
      this.deleteCategoriesDialog = false;
      this.categories = this.categories.filter(val => !this.selectedCategories.includes(val));
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000 });
      this.selectedCategories = [];
  }
  confirmDelete() {
    if (this.category.id) {
      const categoryId = this.category.id;
      this.categoryService.deleteCategory(categoryId).subscribe(
        () => {
          console.log('Category deleted successfully:', this.category);
          // Remove the deleted category from the list
          this.categories = this.categories.filter((val) => val.id !== this.category.id);
          this.deleteCategoryDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Category Deleted',
            life: 3000
          });
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    } else {
      console.error('Category ID is null or undefined');
    }
  }

  updateCategory(category: Category) {
    const categoryId = this.category.id;
    this.categoryService.updateCategory(categoryId, category).subscribe(
        (updatedCategory: Category) => {
            // Update the category in the list with the updated values
            const index = this.categories.findIndex(c => c.id === updatedCategory.id);
            if (index !== -1) {
                this.categories[index] = updatedCategory;
            }
            // Show a success message or perform any other necessary actions
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully', life: 3000 });
        },
        (error) => {
            console.error('Error updating category:', error);
            // Show an error message or perform error handling
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category', life: 3000 });
        }
    );
}
  hideDialog() {
      this.categoryDialog = false;
      this.submitted = false;
  }
  findIndexById(id: number): number {
      let index = -1;
      for (let i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id === id) {
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





