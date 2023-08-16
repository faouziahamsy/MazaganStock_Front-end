import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
      
      
    ],
    declarations: [
      UserInfoDialogComponent
    ],
   
    
})
export class AuthModule { }
