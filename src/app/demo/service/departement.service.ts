import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Departement } from '../api/departement';


@Injectable({
  providedIn: 'root', // Or specify the module where you provide the service
})
export class DepartementService {
    private apiUrl = 'http://localhost:8084/departements';
    constructor(private http: HttpClient) { }
    createDepartement(departement: any): Observable<any> {
      return this.http.post(this.apiUrl, departement,{headers: {
        'Content-Type': 'application/json'
      }},);
    }
   
    getDepartements(): Observable<Departement[]> {
        return this.http.get<Departement[]>(this.apiUrl);
    }

    deleteDepartement(departementId: number): Observable<any> {
        const url = `${this.apiUrl}/${departementId}`;
        return this.http.delete(url);
    }

    updateDepartement(departementId: number, departement: Departement): Observable<Departement> {
      const url = `${this.apiUrl}/${departementId}`;
      return this.http.put<Departement>(url, departement);
    }

}
