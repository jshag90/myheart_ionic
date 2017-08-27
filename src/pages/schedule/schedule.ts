import { Component } from '@angular/core';
import { Platform, AlertController, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

import { ScheduleService } from '../services/schedule.service';;

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

    prescriptionName: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications, private scheduleService: ScheduleService) {
        // 초기값 셋팅
        this.startDate = moment(new Date()).format();
        this.endDate = moment(new Date()).add(2, 'days').format();

        this.timeDivisions = [
            { name: '오전', time: '09:00', checked: true },
            { name: '오후', time: '13:00', checked: true },
            { name: '저녁', time: '18:00', checked: true }
        ];

        // 저장된 값이 있으면 값을 불러옵니다.
        this.prescriptionName = this.navParams.data.prescriptionName;
        this.scheduleService.getSchedule(this.prescriptionName).then(res => {
            if (res) {
                const schedule = JSON.parse(res);
                this.endDate = schedule.endDate;
                this.startDate = schedule.startDate;
                this.timeDivisions = schedule.timeDivisions;
            }
        });

        // 알림 기간을 설정
        this.dateChange();

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

    addTimeDivision() {
        this.timeDivisions.push({ name: '추가', time: '20:00', checked: true });
    }

    removeTimeDivision(index) {
        this.timeDivisions.splice(index, 1);
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

        if (this.prescriptionName) {
            // 값들을 DB에 저장합니다.
            const schedule = {
                'startDate': this.startDate,
                'endDate': this.endDate,
                'timeDivisions': this.timeDivisions
            }
            this.scheduleService.setSchedule(this.prescriptionName, schedule);
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
        // TODO : 모든 알람이 해제되도록 구현되어 있음
        this.localNotifications.cancelAll();

        let alert = this.alertCtrl.create({
            title: '알람이 해제되었습니다.',
            buttons: ['Ok']
        });

        alert.present();
    }
}
