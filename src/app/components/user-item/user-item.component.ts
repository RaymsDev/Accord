import { Component, OnInit, Input } from '@angular/core';
import { IUser } from 'src/app/models/IUser';
import { ISelectable } from 'src/app/models/ISelectable';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {
  @Input() SelectableUser: ISelectable<IUser>;
  @Input() canSelect?: boolean;
  constructor() { }

  ngOnInit() { }

  public OnClickToggle() {
    if (this.canSelect) {
      this.SelectableUser.IsSelected = !this.SelectableUser.IsSelected;
    }
  }
}
