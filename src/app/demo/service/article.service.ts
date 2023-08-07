import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../api/article';

@Injectable({
  providedIn: 'root', // Or specify the module where you provide the service
})
export class ArticleService {
    private apiUrl = 'http://localhost:8084/articles';
    constructor(private http: HttpClient) { }
    createArticles(articlesData: Article): Observable<any> {
      return this.http.post(this.apiUrl, articlesData);
    }
   
    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(this.apiUrl);
      }



    deleteArticle(articleId: number): Observable<any> {
        const url = `${this.apiUrl}/${articleId}`;
        return this.http.delete(url);
    }

    updateArticle(articleId: number, article: Article): Observable<Article> {
      const url = `${this.apiUrl}/${articleId}`;
      return this.http.put<Article>(url, articleId);
    }
    }
