import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Articles } from '../api/articles';


@Injectable({
  providedIn: 'root', // Or specify the module where you provide the service
})
export class ArticlesService {
    private apiUrl = 'http://localhost:8084/categories';
    constructor(private http: HttpClient) { }
    createArticles(articlesData: Articles): Observable<any> {
      return this.http.post(this.apiUrl, articlesData);
    }
   
    getCategories(): Observable<Articles[]> {
        return this.http.get<Articles[]>(this.apiUrl);
      }
    }
