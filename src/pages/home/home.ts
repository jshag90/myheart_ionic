import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {AddDrugPage} from '../add-drug/add-drug';
import { DrugService } from '../services/drug.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  drugItems: any[];

  constructor(public navCtrl: NavController,private drugService:DrugService
  ) {
     this.drugService.getTodos().then(res=>{
      this.drugItems = JSON.parse(res) || [];
    });
  }

  goToAddDrugItemPage(){


    this.navCtrl.push(AddDrugPage,{drugItems:this.drugItems});
  }

  deleteDrugItem(drugItem){

    this.drugItems = this.drugItems.filter((res)=>res !== drugItem);

     this.drugService.setTodos(this.drugItems).then(res=>{
      this.drugItems = JSON.parse(res) || [];
    });

  }

}
