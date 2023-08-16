import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { User } from '../demo/api/user';
import { UserService } from '../demo/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoDialogComponent } from '../demo/components/auth/user-info-dialog/user-info-dialog.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    currentUser: User| null;

    @ViewChild('infoButton') infoButton!: ElementRef;

    
    constructor(public layoutService: LayoutService, private userService: UserService, private dialog: MatDialog) { }
    ngOnInit(): void {
        this.currentUser = this.userService.getCurrentUser();
    }


    openUserInfoDialog() {

        const dialogRef = this.dialog.open(UserInfoDialogComponent, {
          width: '300px',
          data: this.currentUser, // Pass the current user to the dialog
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          console.log('Dialog closed', result);
        });
      }
}
