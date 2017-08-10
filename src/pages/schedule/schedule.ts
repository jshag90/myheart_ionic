import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;

  constructor(public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications) {
    this.notifyTime = moment(new Date()).format();
    this.chosenHours = new Date().getHours();
    this.chosenMinutes = new Date().getMinutes();

    this.days = [
      { title: 'Monday', dayCode: 1, checked: false },
      { title: 'Tuesday', dayCode: 2, checked: false },
      { title: 'Wednesday', dayCode: 3, checked: false },
      { title: 'Thursday', dayCode: 4, checked: false },
      { title: 'Friday', dayCode: 5, checked: false },
      { title: 'Saturday', dayCode: 6, checked: false },
      { title: 'Sunday', dayCode: 0, checked: false }
    ];

    this.localNotifications.on("click", (notification, state) => {
      let alert = this.alertCtrl.create({
        title: 'Notifications set',
        buttons: ['Ok']
      });

      alert.present();
    });
  }

  timeChange(time) {
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  ionViewDidLoad() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.localNotifications.hasPermission().then(function (granted) {
          if (!granted) {
            // IOS10의 권한 설정
            this.localNotifications.registerPermission();
          }
        });
      });
    }
  }

  addNotifications() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.

    for (let day of this.days) {
      if (day.checked) {

        let firstNotificationTime = new Date();
        let dayDifference = day.dayCode - currentDay;
        if (dayDifference < 0) {
          dayDifference = dayDifference + 7; // for cases where the day is in the following week
        }

        // 해당요일만큼 날짜를 변경한다.
        firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));

        firstNotificationTime.setHours(this.chosenHours);
        firstNotificationTime.setMinutes(this.chosenMinutes);
        alert(firstNotificationTime);

        let notification = {
          id: day.dayCode,
          title: '약먹을 시간',
          text: '약 드세요!!!!!',
          at: firstNotificationTime,
        };

        this.notifications.push(notification);
      }
    }

    if (this.platform.is('cordova')) {
      // Cancel any existing notifications
      this.localNotifications.cancelAll().then(() => {

        // Schedule the new notifications
        this.localNotifications.schedule(this.notifications);
        this.notifications = [];

        let alert = this.alertCtrl.create({
          title: 'Notifications set',
          buttons: ['Ok']
        });

        alert.present();
      });
    }
  }

  cancelAll() {
    this.localNotifications.cancelAll();

    let alert = this.alertCtrl.create({
      title: 'Notifications cancelled',
      buttons: ['Ok']
    });

    alert.present();
  }
}
