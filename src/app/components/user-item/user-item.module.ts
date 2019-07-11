import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserItemComponent } from './user-item.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [
        UserItemComponent
    ],
    exports: [
        UserItemComponent
    ]
    // declarations: [
    //     UserItemComponent
    // ]
})
export class UserItemModule { }
