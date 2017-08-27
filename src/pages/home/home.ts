import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AddDrugPage } from '../add-drug/add-drug';
import { SchedulePage } from '../schedule/schedule';
import { DrugService } from '../services/drug.service';

import { AboutPage } from '../about/about';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  perscriptionName: any[];


  constructor(
    public navCtrl: NavController,
    private DrugService: DrugService,
    public alertCtrl: AlertController
  ) {
    //this.items = ["Eat lunch","Walk the dog","Watch movie"];
    this.DrugService.getPerscriptions().then(res => {
      this.perscriptionName = JSON.parse(res) || [];
    });

  }

  alertDrugInfoByPer(perscriptionName) {
    console.log("선택한 처방전 이름 : " + JSON.stringify(perscriptionName));

    this.DrugService.getDrugsByPer(perscriptionName).then(res => {
      //alert(res);
      let alert = this.alertCtrl.create({
        title: '약품정보',
        subTitle: res,
        buttons: ['OK']
      });
      alert.present();


    });

  }

  //네비게이션 컨트롤러 기능 설정
  goToAddDrugPage() {
    this.navCtrl.push(AddDrugPage, { PerscriptionName: this.perscriptionName });
  }


  goToSchedulePage(perscriptionName) {
    console.log(perscriptionName)
    this.navCtrl.push(SchedulePage, { PerscriptionName: perscriptionName });
  }

  deleteDrug(perscriptionName) {
    this.perscriptionName = this.perscriptionName.filter((res) => res !== perscriptionName);

    this.DrugService.setPerscriptions(this.perscriptionName).then(res => {
      this.perscriptionName = JSON.parse(res) || [];
    });


  }

}
