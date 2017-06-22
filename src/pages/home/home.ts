import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider} from '../../providers/auth/auth';
import { ModulesPage } from '../modules/modules';
import { SettingsPage } from '../settings/settings';
import { ResultsPage } from '../results/results';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private welcomeText:string = 'Welkom ' + this.auth.user.first_name;
  private welcomeQuestion:string = 'Leuk dat je onze app uitprobeert.';

  private GREATINGS = ['Welkom terug','Hey ' + this.auth.user.first_name, 'Leuk je terug te zien', 'Hallo daar', 'Goedendag ' + this.auth.user.first_name];
  private QUESTIONS = ['Alles goed met jou?', 'Hoe gaat het vandaag met je?', 'Leuk dat je terug bent', 'Klaar om eraan te werken vandaag?', 'Hoe voel je je vandaag?'];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams,
        private auth: AuthProvider) {

    if(!this.navParams.get('first_time')){
      this.pickRandomText();
    }
  }

  goToModules() {
    this.navCtrl.push(ModulesPage);
  }

  goToResults(){
    this.navCtrl.push(ResultsPage);
  }

  openSettings() {
    const yourModal = this.modalCtrl.create(SettingsPage, {}, {
      showBackdrop: false,
      enableBackdropDismiss: false,
      enterAnimation: 'modal-slide-down',
      leaveAnimation: 'modal-slide-up'
    });

    yourModal.present();
  }

  private pickRandomText(){
      this.welcomeText = this.GREATINGS[Math.floor(Math.random() * this.GREATINGS.length)];
      this.welcomeQuestion = this.QUESTIONS[Math.floor(Math.random() * this.QUESTIONS.length)];
  }

}
