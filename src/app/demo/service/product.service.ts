import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class ProductService {
    private apiUrl = 'http://localhost:8084/equipements';
    constructor(private http: HttpClient) { }
    createEquipment(formData: FormData): Observable<any> {
        return this.http.post<any>(this.apiUrl, formData);
      }
      saveEquipment(equipment: Product): Observable<any> {
        const url = `${this.apiUrl}`; // Assuming your backend endpoint is "/equipment"
        return this.http.post<any>(url, equipment);
      }

    getEquipments(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    deleteEquipment(equipmentId: number): Observable<any> {
        const url = `${this.apiUrl}/${equipmentId}`;
        return this.http.delete(url);
    }

    updateEquipment(equipmentId: number, product: Product): Observable<Product> {
      const url = `${this.apiUrl}/${equipmentId}`;
      return this.http.put<Product>(url, product);
    }
    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
