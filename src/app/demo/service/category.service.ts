import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Category } from '../api/category';


@Injectable({
  providedIn: 'root', // Or specify the module where you provide the service
})
export class CategoryService {
    private apiUrl = 'http://localhost:8084/categories';
    constructor(private http: HttpClient) { }
    createCategory(category: any): Observable<any> {
      return this.http.post(this.apiUrl, category,{headers: {
        'Content-Type': 'application/json'
      }},);
    }
   
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    deleteCategory(categoryId: number): Observable<any> {
        const url = `${this.apiUrl}/${categoryId}`;
        return this.http.delete(url);
    }

    updateCategory(categoryId: number, category: Category): Observable<Category> {
      const url = `${this.apiUrl}/${categoryId}`;
      return this.http.put<Category>(url, category);
    }

}
