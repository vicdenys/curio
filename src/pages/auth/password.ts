import { Component } from '@angular/core';
import { AuthProvider} from '../../providers/auth/auth';
import { NavController, LoadingController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { Storage } from "@ionic/storage";
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'password-page',
  templateUrl: 'password.html'
})
export class PasswordPage {

  private authType: string = "login";
  private loading: any;

  private formOne: FormGroup;

  constructor(private auth: AuthProvider, public navCtrl: NavController, public storage: Storage,
        private loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder) {


    // setup login form
    this.formOne = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(200), Validators.required, Validators.email])]
    });
  }

  // Show loader modal with custom spinner animation
  //------------------------------------------------
  private showLoader(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Verzenden...</p><img src='./assets/img/icon/loader.svg' alt='loader animation'></div></div>",
    });
    this.loading.present();
  }

  // Check if is user is loggin in or registering and validate form
  //------------------------------------------------

  // Send login request to server
  //------------------------------
  private reset(credentials){
    this.showLoader();
    this.auth.resetPasswordEmail(credentials).then(
      data => {
        this.loading.dismiss();
        this.showAlert('E-mail verstuurd!', 'Ga naar je inbox om uw wachtwoord te wijzigen.', 'Ok');
      }
    ).catch(err => this.showError(err));
  }


  // Show error if login failed
  //------------------------------------------------
  private showError(err) {
    console.log(err);
    this.loading.dismiss();
    if (err.status == 401){
      this.showAlert('Oeps!', 'Dit e-mailadres wordt nog niet gebruikt!', 'Ok');
    } else if(err.status == 422) {
      this.showAlert('Oeps!', 'Geen geldig e-mailadres!', 'Ok');
    } else {
      this.showAlert('Oeps!', 'Server momenteel onbereikbaar. Probeer later opnieuw!', 'Ok');
    }
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

  goBack() {
    this.navCtrl.pop();
  }


}
