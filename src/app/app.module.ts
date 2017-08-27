import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SchedulePage } from '../pages/schedule/schedule';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AddDrugPage } from '../pages/add-drug/add-drug';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { DrugService } from '../pages/services/drug.service';
import { ScheduleService } from '../pages/services/schedule.service';;

@NgModule({
  declarations: [
    MyApp,
    SchedulePage,
    ContactPage,
    HomePage,
    TabsPage,
    AddDrugPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SchedulePage,
    ContactPage,
    HomePage,
    TabsPage,
    AddDrugPage
  ],
  providers: [
    IonicStorageModule,
    StatusBar,
    SplashScreen,
    DrugService,
    ScheduleService,
    LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
