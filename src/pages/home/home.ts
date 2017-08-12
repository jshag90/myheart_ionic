import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AddDrugPage } from '../add-drug/add-drug';
import { DrugService } from '../services/drug.service';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  drugItems: any[];

  constructor(public navCtrl: NavController,private drugService:DrugService
  ) {
     this.drugService.getDrugs().then(res=>{
      this.drugItems = JSON.parse(res) || [];
    });
  }

  goToAddDrugItemPage(){

    this.navCtrl.push(AddDrugPage,{drugItems:this.drugItems});

  }

  deleteDrugItem(drugItem){

    console.log('선택한 약품'+JSON.stringify(drugItem))
    this.drugItems = this.drugItems.filter((res)=>res !== drugItem);

    this.drugService.setDrugs(this.drugItems).then(res=>{
      this.drugItems = JSON.parse(res) || [];
    });

  }

  goToSchedulePage(drugItem){
    console.log('선택한 약품'+JSON.stringify(drugItem))
    this.navCtrl.push(AboutPage,{DrugName:drugItem});

  }

}
