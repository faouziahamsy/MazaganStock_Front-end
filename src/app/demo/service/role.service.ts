import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Role } from '../api/role';


@Injectable({
  providedIn: 'root', // Or specify the module where you provide the service
})
export class RoleService {
    private apiUrl = 'http://localhost:8084/roles';
    constructor(private http: HttpClient) { }
    createRole(role: any): Observable<any> {
      return this.http.post(this.apiUrl, role,{headers: {
        'Content-Type': 'application/json'
      }},);
    }
   
    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.apiUrl);
    }

    deleteRole(roleId: number): Observable<any> {
        const url = `${this.apiUrl}/${roleId}`;
        return this.http.delete(url);
    }

    updateRole(roleId: number, role: Role): Observable<Role> {
      const url = `${this.apiUrl}/${roleId}`;
      return this.http.put<Role>(url, role);
    }

}
