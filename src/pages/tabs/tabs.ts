import { Component } from '@angular/core';

import { SchedulePage } from '../schedule/schedule';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = HomePage;
    tab2Root = ContactPage;

    constructor() {

    }
}
