import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
@Injectable()
export class DrugService {
    constructor(public storage: Storage) {
    }
    getPerscriptions() {
        return this.storage.get('perscriptions');
    }
    setPerscriptions(perscriptions) {
        return this.storage.set('perscriptions', JSON.stringify(perscriptions));
    }

    getDrugsByPer(perscriptions) {
        return this.storage.get(perscriptions);
    }

    setDrugsByPer(perscriptions, drugs) {
        console.log('추가 처방전 :' + JSON.stringify(perscriptions));
        console.log('추가 약품 :' + JSON.stringify(drugs));
        return this.storage.set(perscriptions, JSON.stringify(drugs));
    }


}