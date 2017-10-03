import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DrugService {
    constructor(public storage: Storage) {
    }

    clearStorage() {
        return this.storage.clear();
    }

    getPerscriptions() {
        return this.storage.keys();
    }

    getPrescription(prescriptionName) {
        return this.storage.get(prescriptionName);
    }

    setPrescription(prescriptionName, prescription) {
        return this.storage.set(prescriptionName, JSON.stringify(prescription));
    }

    removePrescription(prescriptionName) {
        return this.storage.remove(prescriptionName).then();
    }
}