import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departement } from 'src/app/demo/api/departement';
import { Role } from 'src/app/demo/api/role';
import { User } from 'src/app/demo/api/user';
import { DepartementService } from 'src/app/demo/service/departement.service';
import { RoleService } from 'src/app/demo/service/role.service';
import { UserService } from 'src/app/demo/service/user.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegisterComponent implements OnInit {


  users:User;
  user: User = {} as User;
  userForm: FormGroup;
  departements:Departement[] =[];
  roles:Role[] =[];
  role: Role;
  departement:Departement;


  valCheck: string[] = ['remember'];

  password!: string;
  confirmPassword: string = '';

  constructor(public layoutService: LayoutService, 
    private userService:UserService,
     private fb: FormBuilder, 
    private departementService: DepartementService,
    private roleService: RoleService) { }

  ngOnInit() {
    this.createForm();
   this.loadDepartements();
   this.loadRoles();
}



createForm() {
  this.userForm = this.fb.group({
    matricule: ['', Validators.required],
    nom: ['', Validators.required],
    prenom: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    departement: [''],
    role: [''],
  });
}
loadDepartements() {
  this.departementService.getDepartements().subscribe(
    (data: Departement[]) => {
      this.departements = data;
      console.log(data);
    },
    (error) => {
      console.error('Error fetching departements:', error);
    }
  );
}

loadRoles() {
  this.roleService.getRoles().subscribe(
    (data: Role[]) => {
      this.roles = data;
      console.log(data);
    },
    (error) => {
      console.error('Error fetching roles:', error);
    }
  );
}
onSubmit() {
  const userData: User = {
    matricule: this.user.matricule.toString(),
    nom: this.user.nom,
    prenom: this.user.prenom,
    email: this.user.email,
    password: this.user.password,
    departementId: this.user.departement.id,
    roleId: this.user.role.id,
  };
  console.log('User registration data:', userData)

  this.userService.createUser(userData).subscribe(
   
    (response) => {
      
     // const newUser: User = {...response};
      console.log('User registered successfully!', response);
    },
    (error) => {
      console.error('Error while registering user:', error);
    }
  );

}




  registerUser() {

    if (this.user.password !== this.confirmPassword) {
      // Handle password mismatch
      return;
    }

    this.userService.createUser(this.user)
      .subscribe(
        response => {
          // Handle successful registration
        },
        error => {
          // Handle registration error
        }
      );
  }
 



}
