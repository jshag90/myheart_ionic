import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DrugService } from '../services/drug.service';

@Component({
  selector: 'page-add-drug',
  templateUrl: 'add-drug.html',
})
export class AddDrugPage {

   newDrug:string;

   drugItems:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private drugService:DrugService) {
  }

  ionViewDidLoad() {
     console.log(this.navParams.data.newDrug);
    console.log('ionViewDidLoad AddDrug');
  }

  saveDrug(){
    this.drugItems = this.navParams.data.drugItems || [];

    this.drugItems.push(this.newDrug);

    this.drugService.setTodos(this.drugItems).then(res=>{
      return console.log('New item added.');
    });
    //현재 창을 닫고 home 뷰로 돌아간다.
    this.navCtrl.pop();


  }



}
