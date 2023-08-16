import { Departement } from "./departement";
import { Role } from "./role";

export interface User {
    id?: number;
    nom?: string;
    prenom?:string;
    matricule?:string;
    email?:string;
    password?: string;
    departementId?:number;
    roleId?:number;

    departement?: Departement;
    role?:Role;


}