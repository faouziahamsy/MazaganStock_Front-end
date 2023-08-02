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
    createCategory(categoryData: Category): Observable<any> {
      return this.http.post(this.apiUrl, categoryData);
    }
   
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
      }
    }
