interface InventoryStatus {
    label: string;
    value: string;
}
export interface Product {
    id?: string;
    code?: string;
    dateEntree?: Date;
    dateSortie?: Date;
    name?: string;
    description?: string;
    matricule?: string;
    //price?: number;
    quantity?: number;
    inventoryStatus?: InventoryStatus;
    category?: string;
    image?: File;
   // rating?: number;
}