import { Component } from '@angular/core';


import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AdMobPro } from '@ionic-native/admob-pro';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;


  constructor(private platform: Platform, private admob: AdMobPro,
    statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ionViewDidLoad() {
    this.admob.onAdDismiss()
      .subscribe(() => { console.log('User dismissed ad'); });
  }

  onClick() {
    let adId;
    if (this.platform.is('android')) {
      adId = 'ca-app-pub-6669682457787065/4165674329';
    } else if (this.platform.is('ios')) {
      adId = 'YOUR_ADID_IOS';
    }
    this.admob.prepareInterstitial({ adId: adId })
      .then(() => { this.admob.showInterstitial(); });
  }

}

