import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//TodoService 를 불러온다.
import { DrugService } from '../services/drug.service';




@Component({
  selector: 'page-add-drug',
  templateUrl: 'add-drug.html'
})

export class AddDrugPage {
  newPerscriptionName: string;
  newDrugName: String;

  perscriptionNameArr: any[];
  perNameArrByDrug: any[];

  // html: String = ' <ion-button>test</ion-button> ';
  newDrugNameArr: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private drugService: DrugService) {

    this.newDrugNameArr = [''];
  }

  //@ViewChild('dataContainer') dataContainer: ElementRef;

  addMore() {
    //this.html += ' <ion-button>test</ion-button> ';
    this.newDrugNameArr.push('');

  }

  deleteDrug(index) {

    this.newDrugNameArr.splice(index, 1);
  }

  ionViewDidLoad() {
    //확인차원에서 넘겨받은 items 값을 콘솔에 표시해본다.
    //home.ts에서 넘겨 받은 파라미터 키값이랑 같아야함.
    console.log(this.navParams.data.PerscriptionName);
  }

  save() {
    //this.navParams.data.items 이 null 값으로 넘어올 때 array를 반환하도록 처리.
    this.perscriptionNameArr = this.navParams.data.PerscriptionName || [];
    //새로운 item을 items에 추가.
    this.perscriptionNameArr.push(this.newPerscriptionName);
    //todoService를 사용하여 데이타베이스 업데이트.
    this.drugService.setPerscriptions(this.perscriptionNameArr).then(res => {
      return console.log('New perscription added.');
    });

    this.perNameArrByDrug = this.navParams.data.newDrugNameArr || [];
    this.perNameArrByDrug.push(this.newDrugNameArr);

    this.drugService.setDrugsByPer(this.newPerscriptionName, this.perNameArrByDrug).then(res => {
      return console.log('new drugsByPer added.');
    })
    //새로 입력한 newItem 값은 items array에 추가한다.
    //this.navParams.data.items.push(this.newItem);
    //현재 창을 닫고 home 뷰로 돌아간다.
    this.navCtrl.pop();
  }
}