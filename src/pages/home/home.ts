import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
        public alertCtrl: AlertController
    ) {}
    
    ionViewWillEnter() {
        this.drugService.getPerscriptions().then(res => {
            this.perscriptions = res || [];
        });
    }

    alertDrugInfoByPer(perscriptionName) {
        console.log("선택한 처방전 이름 : " + JSON.stringify(perscriptionName));
        this.drugService.getPrescription(perscriptionName).then(res => {
            let alert = this.alertCtrl.create({
                title: '약품정보',
                subTitle: res,
                buttons: ['OK']
            });
            alert.present();
        });
    }

    //네비게이션 컨트롤러 기능 설정
    goToSchedulePage(prescriptionName) {
        this.navCtrl.push(SchedulePage, { prescriptionName : prescriptionName});
    }

    deleteDrug(perscriptionName) {
        // this.perscriptionName = this.perscriptionName.filter((res) => res !== perscriptionName);

        // this.DrugService.setPerscriptions(this.perscriptionName).then(res => {
        //     this.perscriptionName = JSON.parse(res) || [];
        // });
    }
}
