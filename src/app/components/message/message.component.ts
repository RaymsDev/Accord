import {
  Component,
  OnInit,
  Input,
  Output,
  AfterViewInit,
  EventEmitter
} from '@angular/core';
import { IMessage } from 'src/app/models/IMessage';
import { IUser } from 'src/app/models/IUser';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {
  @Input() Message: IMessage;
  @Input() CurrentUser: IUser;
  @Input() isLast: boolean;
  @Output() lastRendered = new EventEmitter();
  public AdorableUrl = 'https://api.adorable.io/avatars/285/';
  constructor() {}

  ngOnInit() {}
  ngAfterViewInit() {
    // Solution pour trigger le scroll bottom après le render
    if (this.isLast) {
      this.lastRendered.emit('lastRendered');
    }
  }
}
