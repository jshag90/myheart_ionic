import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { Platform, AlertController, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';

import { DrugService } from '../services/drug.service';

@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html'
})
export class SchedulePage {
    drugs: object[];

    startDate: string;
    endDate: string;
    period: number;

    notifications: any[] = [];
    timeDivisions: any[];
    notificationIds: number[] = [];

    prescriptionName: string;


    constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public alertCtrl: AlertController, public localNotifications: LocalNotifications,
        private drugService: DrugService) {
        // 초기값 셋팅
        this.prescriptionName = '';
        this.drugs = [{}];
        this.startDate = moment(new Date()).format();
        this.endDate = moment(new Date()).add(2, 'days').format();

        this.timeDivisions = [
            { name: '오전', time: '09:00', checked: true },
            { name: '오후', time: '13:00', checked: true },
            { name: '저녁', time: '18:00', checked: true }
        ];

        // 저장된 값이 있으면 값을 불러옵니다.
        if (this.navParams.data.prescriptionName) {
            this.prescriptionName = this.navParams.data.prescriptionName;

            // 데이터를 불러옵니다.
            this.drugService.getPrescription(this.prescriptionName).then(res => {
                if (res) {
                    const schedule = JSON.parse(res);
                    this.endDate = schedule.endDate;
                    this.startDate = schedule.startDate;
                    this.timeDivisions = schedule.timeDivisions;
                    this.drugs = schedule.drugs;
                    this.notificationIds = schedule.notificationIds;
                }
            });
        }

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

    addDrug(i) {
        // 마지막 필드까지 입력하였을때 약품 입력 필드를 추가함.
        if (i == (this.drugs.length - 1)) {
            this.drugs.push({});
        }
    }

    removeDrug(index) {
        this.drugs.splice(index, 1);
    }

    dateChange() {
        // 스케줄 기간
        this.period = moment(this.endDate).diff(moment(this.startDate), 'days') + 1;
    }

    addTime(dateDivision, add) {
        // + - 버튼을 통한 날짜 수정
        if ('start' === dateDivision) {
            this.startDate = moment(this.startDate).add(add, 'days').format();
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

    addPrescription() {
        if (!this.prescriptionName) {
            alert('처방전 이름을 입력해주세요');
        }

        // 해당 처방전의 중복을 체크합니다.
        this.drugService.getPrescription(this.prescriptionName).then(res => {
            if(res && !confirm('해당 처방전이 존재합니다. 수정하시겠습니까?')) {
                return false;
            }

            // 시작일 부터 종료일까지 반복합니다.
            for (let i = 0, j=0; i < this.period; i++) {
                let notificationTime = moment(this.startDate).add(i, 'days').toDate();
                for (let time of this.timeDivisions) {
                    // 선택한 시간에 푸시를 등록합니다.
                    if (time.checked) {
                        notificationTime.setHours(time.time.substring(0, 2));
                        notificationTime.setMinutes(time.time.substring(3));

                        // 지금 시간 이후 알람만 등록합니다.
                        if(moment().toDate() <= notificationTime) {
                            let notificationId = this.hashFunction(this.prescriptionName) + j++;
                            this.notificationIds.push(notificationId);

                            let notification = {
                                id : notificationId,
                                title: '약먹을시간',
                                text: time.name + ' 약 드실 시간입니다.',
                                at: notificationTime
                            };

                            this.notifications.push(notification);
                        }
                    }
                }
            }

            // 값들을 DB에 저장합니다.
            const prescription = {
                'startDate': this.startDate,
                'endDate': this.endDate,
                'timeDivisions': this.timeDivisions,
                'drugs' : this.drugs || [{}],
                'notificationIds' : this.notificationIds
            }

            this.drugService.setPrescription(this.prescriptionName, prescription).then(() => {
            });

            if (this.platform.is('cordova')) {
                let targetIds = res? res.notificationIds : 0;
                // 이전에 해당 처방전에서 등록한 알림이 있다면 해제합니다.
                this.localNotifications.cancel(targetIds).then(() => {
                    this.localNotifications.schedule(this.notifications);
                    this.notifications = [];

                    let alert = this.alertCtrl.create({
                        title: '알람이 설정되었습니다.',
                        buttons: ['확인']
                    });
                    alert.present();
                });
            }

            // 메인화면으로 돌아갑니다
            this.navCtrl.push(HomePage);
        });
    }

    cancelAlarm() {
        this.localNotifications.cancel(this.notificationIds).then(() => {
            let alert = this.alertCtrl.create({
                title: '알람이 해제되었습니다.',
                buttons: ['Ok']
            });
            alert.present();
        });
    }

    hashFunction(prescriptionName: string) :number {
        var hash = 5381, i = prescriptionName.length
        while(i) {
          hash = (hash * 33) ^ prescriptionName.charCodeAt(--i);
        }
        return hash >>> 0;
    }
}
