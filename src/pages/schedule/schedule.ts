import {Component} from '@angular/core';
import {Platform, AlertController} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import * as moment from 'moment';

@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html'
})
export class SchedulePage {
    startDate: string;
    endDate: string;
    period: number;

    notifications: any[] = [];
    timeDivisions: any[];

    constructor(public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications) {
        this.startDate = moment(new Date()).format();
        this.endDate = moment(new Date()).add(2, 'days').format();

        // 알림 기간을 설정
        this.dateChange();

        this.timeDivisions = [
            {name: '오전', time: '09:00', checked: true},
            {name: '오후', time: '13:00', checked: true},
            {name: '저녁', time: '18:00', checked: true}
        ];

        this.localNotifications.on("click", (notification, state) => {
            let alert = this.alertCtrl.create({
                title: '알림이 등록되었습니다.',
                buttons: ['Ok']
            });

            alert.present();
        });
    }

    dateChange() {
        // 스케줄 기간
        this.period = moment(this.endDate).diff(moment(this.startDate), 'days') + 1;
    }

    timeAdd(dateDivision, add) {
        // + - 버튼을 통한 날짜 수정
        if ('start' === dateDivision) {
            this.startDate = moment(this.startDate).add(add, 'days').format();
            console.log(this.startDate);
        }
        else if ('end' === dateDivision) {
            this.endDate = moment(this.endDate).add(add, 'days').format();
        }
    }

    ionViewDidLoad() {
        // TODO: IOS 테스트 필요
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
        // 시작일 부터 종료일까지 반복합니다.
        for (let i = 0; i < this.period; i++) {
            let notificationTime = moment(this.startDate).add(i, 'days').toDate();
            for (let time of this.timeDivisions) {
                // 선택한 시간에 푸시를 등록합니다.
                if (time.checked) {
                    notificationTime.setHours(time.time.substring(0, 2));
                    notificationTime.setMinutes(time.time.substring(3));

                    let notification = {
                        title: '약드세요',
                        text: time.name + ' 약 드실 시간입니다.',
                        at: notificationTime
                    };

                    this.notifications.push(notification);
                }
            }
        }
        
                console.log(this.notifications);

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
            title: '알람이 해제되었습니다.',
            buttons: ['Ok']
        });

        alert.present();
    }
}
