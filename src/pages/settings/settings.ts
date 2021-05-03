import { Component } from '@angular/core';
import { NavController, Config, LoadingController, AlertController, App } from 'ionic-angular';
import { ModalSlideDownTransition } from '../../classes/SlideDownTransition';
import { ModalSlideUpTransition } from '../../classes/SlideUpTransition';

import { MoodNotSettingsPage } from '../../pages/settings/notifications/mood';
import { SleepNotSettingsPage } from '../../pages/settings/notifications/sleep';
import { StartPage } from '../start/start';
import { HomePage } from '../home/home';
import { AuthProvider} from '../../providers/auth/auth';
import { tokenNotExpired } from 'angular2-jwt';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  private loading: any;
  private moodNotTime:string = 'uit';
  private sleepNotTime:string = 'uit';

  constructor(public navCtrl: NavController, private config: Config, private auth: AuthProvider,
    private loadingCtrl: LoadingController, public alertCtrl: AlertController, private app: App,
   private nativeStorage: NativeStorage) {
    this.setCustomTransitions();


  }

  ionViewCanEnter(): boolean{
   return tokenNotExpired(null, this.auth.token);
  }

  ionViewDidEnter(){
    this.nativeStorage.getItem('moodNotTime')
      .then(
        data => {
          if(data.moodNotTimeEnabled){
            this.moodNotTime = data.moodNotTime;
          }else{
            this.moodNotTime = 'uit';
          }
        },
        error => console.error(error)
    );
    this.nativeStorage.getItem('sleepNotTime')
      .then(
        data => {
          if(data.sleepNotTimeEnabled){
            this.sleepNotTime = data.sleepNotTime;
          }else{
            this.sleepNotTime = 'uit';
          }
        },
        error => console.error(error)
    );
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-slide-down', ModalSlideDownTransition);
    this.config.setTransition('modal-slide-up', ModalSlideUpTransition);
  }

  closeSettings(){
    this.navCtrl.pop();
  }

  // Show loader modal with custom spinner animation
  //------------------------------------------------
  private showLoader(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Uitloggen...</p><img src='./assets/img/icon/loader.svg' alt='loader animation'></div></div>",
    });
    this.loading.present();
  }


  private logout(){
    this.showLoader();
    this.auth.logout().then(data => this.backToStartScreen()).catch(err => this.showError(err));
  }

  private backToStartScreen(){
    this.loading.dismiss();
    this.navCtrl.pop().then(() => {
      this.navCtrl.setRoot(StartPage);
    });
  }

  // Show error if login failed
  //------------------------------------------------
  private showError(err) {
    this.loading.dismiss();
    this.showAlert('Oeps!', 'Server momenteel onbereikbaar. Probeer later opnieuw!', 'Ok');
  }

  // Show error message on screen
  //------------------------------------------------
  private showAlert(title: string, subtitle: string, btnTxt: string) {
    let alert = this.alertCtrl.create({
        title: title,
        subTitle: subtitle,
        buttons: [btnTxt]
      });
    alert.present();
  }

  private goToMoodNotPage(){
    this.navCtrl.push(MoodNotSettingsPage);
  }
  private goToSleepNotPage(){
    this.navCtrl.push(SleepNotSettingsPage);
  }

}
