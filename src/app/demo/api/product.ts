import { Category } from "./category";

interface InventoryStatus {
    label: string;
    value: string;
}
export enum EtatEnum {
    INSTOCK = 'INSTOCK',
    LOWSTOCK = 'LOWSTOCK',
    OUTOFSTOCK = 'OUTOFSTOCK',
  }
export interface Product {
    id?: number;
    code?: string;
    dateEntree?: Date;
    dateSortie?: Date;
    name?: string;
 
    matricule?: string;
    
    quantity?: number;
    categoryId?:number;
   
    category?: Category;
    image?: File;
    etat?: EtatEnum;
    
  
}