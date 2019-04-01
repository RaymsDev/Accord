import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../services/friends.service';
import { IUser } from '../models/IUser';
import { Platform, ToastController } from '@ionic/angular';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { ISelectable } from '../models/ISelectable';
import { Selectable } from '../models/Selectable';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.page.html',
  styleUrls: ['./friend.page.scss']
})
export class FriendPage implements OnInit {
  // Variables
  myFriends: IUser[] = [];

  selectedSearch = 'Nickname';
  searchBy = ['Nickname', 'Phone Number'];
  searchString: string;

  possible_friend_to_add: IUser[];
  display_possible_friend_list = false;

  displayLoader = false;
  suggest_friend_btn = true;
  suggested_friend: IUser[] = [];
  allContacts: Contact[];

  phonesNum: string[];

  noFriendFound = false;
  noSuggestFriend = false;

  public IsMobile: boolean;
  // working variables

  constructor(
    private friendsService: FriendsService,
    private platform: Platform,
    private contactsPhone: Contacts,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.IsMobile = this.platform.is('mobile');
  }

  ionViewDidEnter() {
    this.friendsService.getMyFriend().subscribe(friends => {
      this.myFriends = friends;
    });
  }

  getAccessToAllContact() {
    return this.contactsPhone
      .find(['displayName', 'phoneNumbers'], {
        filter: '',
        multiple: true,
        hasPhoneNumber: true
      })
      .then(data => {
        this.allContacts = data;
        this.phonesNum = data.map(contact =>
          this.formatPhoneNumber(contact.phoneNumbers.shift().value)
        );
        this.phonesNum = this.phonesNum.filter(el => el != null);
        this.fireArrayPhoneSearch(this.phonesNum);
      })
      .catch(error => {
        console.error(error);
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
      this.getAccessToAllContact();
    }
  }

  fireArrayPhoneSearch(phoneArray = []) {
    this.suggested_friend = [];
    this.friendsService.getContactByPhoneNumber(phoneArray).subscribe(users => {
      this.suggested_friend = users
        .filter(u => !!u)
        .filter(u => !this.myFriends.some(f => f.uid === u.uid)); // Don't show already friends
      if (this.suggested_friend.length === 0) {
        this.showNoFriendToast();
      }
    });
    this.displayLoader = false;
  }

  private async showNoFriendToast() {
    const toast = await this.toastController.create({
      duration: 3000,
      message: 'No friend found!',
      color: 'danger'
    });

    toast.present();
  }

  searchSomeoneClick() {
    if (this.searchString) {
      this.noFriendFound = false;
      if (this.selectedSearch === 'Nickname') {
        this.friendsService
          .searchFriendByNickName(this.searchString)
          .subscribe(users => {
            if (
              users.length &&
              !this.myFriends.some(u => users[0].id === u.id)
            ) {
              this.possible_friend_to_add = users
                .filter(u => !!u)
                .filter(u => !this.myFriends.some(f => f.uid === u.uid));
              this.display_possible_friend_list = true;
            } else {
              this.display_possible_friend_list = false;
              this.noFriendFound = true;
            }
          });
      } else {
        const phoneToSearch = this.formatPhoneNumber(this.searchString);
        this.friendsService
          .getContactToOnePhoneNumber(phoneToSearch)
          .subscribe(user => {
            if (user && !this.myFriends.some(u => user.id === u.id)) {
              this.possible_friend_to_add = [user];
              this.display_possible_friend_list = true;
            } else {
              this.display_possible_friend_list = false;
              this.noFriendFound = true;
            }
          });
      }
    }
  }

  addToMyFriend() {
    if (this.possible_friend_to_add.length) {
      this.friendsService.addToMyFriendByUid(this.possible_friend_to_add[0]);
      this.possible_friend_to_add = [];
    }
  }

  addSuggestedFriend(friend: IUser) {
    const { uid } = friend;
    this.friendsService.addToMyFriendByUid(uid);
    this.myFriends.push(friend);
    this.removeOfSuggestedFriend(uid);
  }

  removeOfSuggestedFriend(uid) {
    for (let index = 0; index < this.suggested_friend.length; index++) {
      if (this.suggested_friend[index].uid === uid) {
        this.suggested_friend.splice(index, 1);
      }
    }
    for (let index = 0; index < this.possible_friend_to_add.length; index++) {
      if (this.possible_friend_to_add[index].uid === uid) {
        this.possible_friend_to_add.splice(index, 1);
      }
    }
  }

  removeFriend(friend: IUser) {
    const { uid } = friend;
    this.friendsService.removeFriend(uid).subscribe(async () => {
      const toast = await this.toastController.create({
        duration: 3000,
        message: 'Friend remove!',
        color: 'secondary'
      });
      for (let index = 0; index < this.myFriends.length; index++) {
        if (this.myFriends[index].uid === uid) {
          this.myFriends.splice(index, 1);
        }
      }
      toast.present();
    });
  }
}
