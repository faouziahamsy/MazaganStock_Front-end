interface InventoryStatus {
    label: string;
    value: string;
    
}
export enum EtatEnum {
    INSTOCK = 'INSTOCK',
    LOWSTOCK = 'LOWSTOCK',
    OUTOFSTOCK = 'OUTOFSTOCK',
  }
export interface Article {
    id?: number;
    matricule?: string;
    quantity?:number;
    etat?: EtatEnum;
    dateEntree?: Date;
    dateSortie?: Date;
}