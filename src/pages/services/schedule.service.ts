import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class ScheduleService {
    constructor(public storage: Storage) {
    }

    getSchedule(prescriptionName) {
        return this.storage.get(prescriptionName);
    }

    setSchedule(prescriptionName, schedule) {
        return this.storage.set(prescriptionName, JSON.stringify(schedule));
    }
}