import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { SchedulePage } from '../schedule/schedule';
import { DrugService } from '../services/drug.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    perscriptions: string[];

    constructor(
        public navCtrl: NavController,
        private drugService: DrugService,
        public platform: Platform, 
        public localNotifications: LocalNotifications,
        public alertCtrl: AlertController
    ) { }

    ionViewWillEnter() {
        this.drugService.getPerscriptions().then(res => {
            this.perscriptions = res || [];
        });
    }

    //네비게이션 컨트롤러 기능 설정
    goToSchedulePage(prescriptionName) {
        this.navCtrl.push(SchedulePage, { prescriptionName: prescriptionName });
    }

    // 처방전을 삭제합니다.
    removePrescription(prescriptionName) {
        if (confirm('처방전을 정말 삭제하시겠습니까?')) {
            this.drugService.getPrescription(prescriptionName).then(res => {
                if (res) {
                    let notificationIds = JSON.parse(res).notificationIds;

                    this.drugService.removePrescription(prescriptionName).then(() => {
                        // 등록된 처방전을 삭제합니다.
                        if (!this.platform.is('cordova')) {
                            return this.ionViewWillEnter();
                        }
                        
                        // 알람을 삭제합니다.
                        this.localNotifications.cancel(notificationIds).then(() => {
                            this.ionViewWillEnter();
                        });
                    });
                }
            });
        }
    }
}
