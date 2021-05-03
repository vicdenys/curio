import { Component } from '@angular/core';
import { NavController, Config, App, AlertController } from 'ionic-angular';

import { StartPage } from '../../start/start';
import { HomePage } from '../../home/home';
import { AuthProvider} from '../../../providers/auth/auth';
import { tokenNotExpired } from 'angular2-jwt';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'mood-not-settings',
  templateUrl: 'mood.html'
})
export class MoodNotSettingsPage {

  private loading: any;
  private time:any = '09:00';
  private timeEnabled:boolean = false;
  private notId:number = 1;
  private scheduledDate:Date = new Date( new Date().setHours(9,0,0,0));

  constructor(public navCtrl: NavController, private config: Config, private auth: AuthProvider,
     private app: App, public alertCtrl: AlertController, private datePicker: DatePicker,
     private localNotifications: LocalNotifications, private nativeStorage: NativeStorage) {

    this.nativeStorage.getItem('moodNotTime')
      .then(
        data => {
          this.time = data.moodNotTime;
          this.timeEnabled = data.moodNotTimeEnabled;
          this.scheduledDate = data.scheduledDate;
        },
        error => console.error(error)
    );
  }

  ionViewCanEnter(): boolean{
   return tokenNotExpired(null, this.auth.token);
  }

  closeSettings(){
    this.navCtrl.pop();
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

  private cancelNotifications(){
    this.localNotifications.cancel(this.notId);
    this.storeNotData();
    console.log('notification canceled');
  }

  private notificationChanged(){

    if (this.timeEnabled){
      this.localNotifications.registerPermission().then(
        data =>{
          if(data==false){
            this.showAlert('Toestemming is nodig!', 'Ga naar de instellingen van je iphone en sta pushberichten toe.', 'OK');
            this.timeEnabled = false;
            this.cancelNotifications();
          }else{
            console.log('is active');
            this.scheduleNot(this.scheduledDate);
            this.storeNotData();
          }
        },
        error => {
          this.showAlert('Toestemming is nodig!', 'Ga naar de instellingen van je iphone en sta pushberichten toe.', 'OK');
          this.timeEnabled = false;
          this.cancelNotifications();
      });
    }else{
      this.timeEnabled = false;
      this.cancelNotifications();
    }


  }

  private scheduleNot(date){
    let d = new Date(date);
    if(d <=  new Date()){
      d.setDate(d.getDate() + 1);
      console.log('date is tomorrow');
    }

    console.log(new Date(d.getTime()));

    this.localNotifications.schedule({
       id: this.notId,
       text: 'Hey! Tijd voor een nieuwe stemmingstest.',
       sound: 'file://beep.caf',
       every: 'day',
       at: new Date(d.getTime()),
    });
  }

  private storeNotData(){
    this.nativeStorage.setItem('moodNotTime', {moodNotTimeEnabled: this.timeEnabled, moodNotTime: this.time, scheduledDate: this.scheduledDate})
      .then(
        () => {
          console.log('Stored item!')
      },
        error => console.error('Error storing item', error)
      );
  }

  private dateChanged(event){
    this.cancelNotifications();
    if(this.timeEnabled){
      let date = new Date();
      date.setHours(event.hour, event.minute, 0, 0);

      this.scheduledDate = date;
      // Schedule delayed notification
      this.scheduleNot(date);

      this.storeNotData();
      console.log('notification scheduled');
    }
  }

}
