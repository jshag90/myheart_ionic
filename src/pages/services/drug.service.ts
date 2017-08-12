import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
@Injectable()
export class DrugService {
    constructor(public storage: Storage) {
    }

    getDrugs(){
        return this.storage.get('drugItems');
    }

    setDrugs(drugItems){
        return this.storage.set('drugItems',JSON.stringify(drugItems));
    }

    setWeekDaysByDrugName(drugName,weekDaysByDrug){
        return this.storage.set(drugName,JSON.stringify(weekDaysByDrug));

    }

    getWeekDaysByDrugName(drugName){
        return this.storage.get(drugName);
    }




}