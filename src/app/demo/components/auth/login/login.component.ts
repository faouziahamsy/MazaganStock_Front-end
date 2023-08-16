import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/demo/api/user';
import { UserService } from 'src/app/demo/service/user.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    users:User;
    user: User = {} as User;

    valCheck: string[] = ['remember'];

    password!: string;
    errorMessage: string;


    constructor(public layoutService: LayoutService, private userService: UserService, private router: Router) { }

    onSubmit(){
        console.log('====================================');
        console.log(this.user);
        console.log('====================================');
        this.userService.loginUser(this.user).subscribe(
            (response) => {
                this.userService.setCurrentUser(response);
             // const newUser: User = {...response};
              console.log('login successfully!', response);
              this.router.navigate(['/']);
             
            },
            (error) => {
              console.error('Login failed:', error);
              this.errorMessage = 'Login or password incorrect. Please try again.';
          }
          );

        }

    }

