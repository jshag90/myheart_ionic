import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

import { DrugService } from '../services/drug.service';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  drugName: string;
  weekDays: any[];
  weekDaysListByDrug: any[];

  selectWeekDaysByDrugName: string;


  constructor(public navCtrl: NavController,public navParams: NavParams
  ,private drugService:DrugService) {

  }

  ionViewDidLoad() {
    //앞 페이지에서 받은 약품명을 받음
    this.drugName = this.navParams.data.DrugName

      this.drugService.getWeekDaysByDrugName(this.drugName).then(res=>{
      this.selectWeekDaysByDrugName = JSON.parse(res) || "";
      console.log('요일 후출 : '+JSON.parse(res))
    });


  }



  saveWeekDays(drugName){
    this.weekDaysListByDrug = [];
    this.weekDaysListByDrug.push(drugName)
    this.weekDaysListByDrug.push(this.weekDays)

    this.drugService.setWeekDaysByDrugName(drugName,this.weekDays).then(res=>{
      return console.log('add weekdays');
    });

     //현재 창을 닫고 home 뷰로 돌아간다.
    this.navCtrl.pop();

  }





}
