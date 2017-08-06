import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
@Injectable()
export class DrugService {
    constructor(public storage: Storage) {
    }
    getTodos(){
        return this.storage.get('drugItems');
    }
    setTodos(drugItems){
        return this.storage.set('drugItems',JSON.stringify(drugItems));
    }
}