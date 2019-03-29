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

  // Variables
  myFriends: IUser[] = [];

  selectedSearch = 'Nickname';
  searchBy = ['Nickname', 'Phone Number'];
  searchString: string;


  possible_friend_to_add: IUser[];

  displayLoader = false;
  suggest_friend_btn = true;
  suggested_friend: any;
  allContacts: Contact[];

  phonesNum: string[];

  noFriendFound = false;
  noSuggestFriend = false;

  // working variables

  constructor(private friendsService: FriendsService, private platform: Platform, private contactsPhone: Contacts) {
  }

  ngOnInit() {
    this.friendsService.getMyFriend().subscribe(friends => this.myFriends = friends);
  }

  getAccessToAllContact() {
    return this.contactsPhone.find(['displayName', 'phoneNumbers'], { filter: '', multiple: true, hasPhoneNumber: true })
      .then(data => {
        this.allContacts = data;
        this.phonesNum = data.map(contact => this.formatPhoneNumber(contact.phoneNumbers.shift().value));
        this.phonesNum = this.phonesNum.filter(el => el != null);
      });
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

  onClickSuggestFriend() {
    if (this.platform.is('mobile')) {
      this.displayLoader = true;
      this.getAccessToAllContact().then(() => {
        this.fireArrayPhoneSearch(this.phonesNum);
      });
    }
  }

  fireArrayPhoneSearch(phoneArray = []) {
    this.suggested_friend = [];
    this.friendsService.getContactByPhoneNumber(phoneArray).subscribe((users) => {
      users.subscribe(
        x => {
          if (x) {
            this.suggested_friend.push(x);
          }
        }
      );
    });
    this.displayLoader = false;
  }

  searchSomeoneClick() {
    if (this.searchString) {
      this.noFriendFound = false;
      if (this.selectedSearch === 'Nickname') {
        this.friendsService.searchFriendByNickName(this.searchString)
          .subscribe((user) => {
            if (user.length) {
              this.possible_friend_to_add = user;
            } else {
              this.noFriendFound = true;
            }
          });
      } else {
        const phoneToSearch = this.formatPhoneNumber(this.searchString);
        this.friendsService.getContactToOnePhoneNumber(phoneToSearch);
      }
    }
  }

  addToMyFriend(friendUid) {
    this.friendsService.addToMyFriendByUid(friendUid);
  }

}
