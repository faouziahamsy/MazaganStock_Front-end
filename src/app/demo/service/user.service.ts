import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from '../api/user';


@Injectable({
  providedIn: 'root', // Or specify the module where you provide the service
})
export class UserService {
  private currentUser: User | null = null;

    private apiUrl = 'http://localhost:8084/users';
    private loginUrl = 'http://localhost:8084/users/login';
    constructor(private http: HttpClient) { }
    createUser(user: any): Observable<any> {
      return this.http.post(this.apiUrl, user,{headers: {
        'Content-Type': 'application/json'
      }},);
    }
    loginUser(user:User):Observable<Object> {
      console.log(user)
      return this.http.post(this.loginUrl,user);
    }
  
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    deleteUser(userId: number): Observable<any> {
        const url = `${this.apiUrl}/${userId}`;
        return this.http.delete(url);
    }

    updateUser(userId: number, user: User): Observable<User> {
      const url = `${this.apiUrl}/${userId}`;
      return this.http.put<User>(url, user);
    }
    setCurrentUser(user: User) {
      this.currentUser = user;
  }
  
  getCurrentUser(): User | null {
      return this.currentUser;
  }

}
