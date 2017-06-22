import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from 'ionic-native';

import { Storage } from "@ionic/storage";

import { StartPage } from '../pages/start/start';

import { AuthProvider} from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = StartPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, auth: AuthProvider, storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      storage.get('token').then(
        data => { auth.token = data;}
      );

      storage.get('user').then(
        data => { auth.user = data;}
      );

      if (window.statusbar) {
        return statusBar.hide();
      }
      splashScreen.hide();

      Network.onDisconnect().subscribe(() => {
        console.log('you are offline');
      });

      Network.onConnect().subscribe(()=> {
        console.log('you are online');
      });


    });
  }
}
