import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../services/friends.service';
import { IUser } from '../models/IUser';
import { Platform } from '@ionic/angular';
import { Http } from '@angular/http';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.page.html',
  styleUrls: ['./friend.page.scss'],
})
export class FriendPage implements OnInit {

  searchNickname: string;
  userTest: IUser;
  friends: IUser[];
  friendToAdd: IUser[];
  allContacts: Contact[];
  allContactOnFirebase: IUser[];
  friends_possibles_nickname: IUser[];
  friends_possible_by_phone_number: any;
  phonesNum: string[];

  constructor(private friendsService: FriendsService, private platform: Platform, private contactsPhone: Contacts) {
    if (platform.is('mobile')) {
      this.getAccessToAllContact().then(() => this.fireArrayPhoneSearch(this.allContacts));
    }
  }

  ngOnInit() {
    // this.friendsService.searchFriendByNickName('Ray').subscribe((users) => this.friends_possibles_nickname = users);
  }

  getAccessToAllContact() {
    return this.contactsPhone.find(['displayName', 'phoneNumbers'], { filter: '', multiple: true, hasPhoneNumber: true })
      .then(data => {
        this.allContacts = data;
        this.phonesNum = data.map(contact => this.formatPhoneNumber(contact.phoneNumbers.shift().value));
        // this.friendsService.getContactByPhoneNumber(this.phonesNum).subscribe(users => this.allContactOnFirebase = users);
      });
  }

  searchSomeoneClick() {
    this.friendsService.searchFriendByNickName(this.searchNickname).subscribe((users) => this.friends_possibles_nickname = users);
  }

  formatPhoneNumber(phoneNumber: string): string {
    phoneNumber = phoneNumber.replace(/\s/g, '');
    if (phoneNumber.substring(0, 3) === '+33') {
      return phoneNumber;
    } else if (phoneNumber.substring(0, 2) === '33') {
      return '+' + phoneNumber;
    } else if (phoneNumber[0] === '0') {
      return '+33' + phoneNumber.slice(1, 9);
    } else {
      console.log('Unexpected phone number:' + phoneNumber);
      return null;
    }

  }

  fireArrayPhoneSearch(phoneArray = []) {
    const phonearray = ['+33682447643', '+33682747643', '+33682447943', '+33682576069'];
    this.friends_possible_by_phone_number = [];
    this.friendsService.getContactByPhoneNumber(phonearray).subscribe((users) => {
      users.subscribe(
        x => {
          if (x) {
            this.friends_possible_by_phone_number.push(x);
          }
        }
      );
    });
  }

}
