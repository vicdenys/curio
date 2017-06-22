import { Component } from '@angular/core';
import { AuthProvider} from '../../providers/auth/auth';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { Storage } from "@ionic/storage";
import { AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordPage } from '../../pages/auth/password';

@Component({
  selector: 'start',
  templateUrl: 'start.html'
})
export class StartPage {

  private authType: string = "aanmelden";
  private loading: any;

  private formOne: FormGroup;
  private showingLogin: boolean = false;

  constructor(private auth: AuthProvider, public navCtrl: NavController, public storage: Storage,
        private loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder,
        public navParams: NavParams) {

    // Check if authenticated => go to hompage
    // else show login
    setTimeout( () => {
      auth.authenticated().then( data => {
          data == true ? navCtrl.push(HomePage) : this.showLogin();
      })
    }, 2000)


    // setup login form
    this.formOne = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(200), Validators.required, Validators.email])],
        password: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
        name: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
        first_name: ['', Validators.compose([Validators.maxLength(200), Validators.required])]
    });

    console.log(this.formOne);
  }

  // Show loader modal with custom spinner animation
  //------------------------------------------------
  private showLoader(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Verifiëren...</p><img src='./assets/img/icon/loader.svg' alt='loader animation'></div></div>",
    });
    this.loading.present();
  }

  // Check if is user is loggin in or registering and validate form
  //------------------------------------------------
  private authenticate(credentials) {
    this.authType == 'aanmelden' ? this.login(credentials) : this.signup(credentials);
  }

  // Send login request to server
  //------------------------------
  private login(credentials){

    credentials = {
      email: credentials.email,
      password: credentials.password
    }

    this.showLoader();
    this.auth.login(credentials).then(
      data => {
        this.loading.dismiss();
        this.navCtrl.push(HomePage).then(d=>console.log(d)).catch(e=>console.log(e));
      }
    ).catch(err => this.showError(err));
  }

  // Send register request to server
  //---------------------------------
  private signup(credentials) {
    this.showLoader();
    this.auth.register(credentials).then(
      data => {
        this.loading.dismiss();
        this.navCtrl.push(HomePage, {'first_time': true}).then(d=>console.log(d)).catch(e=>console.log(e));
      }
    ).catch(err => this.showError(err));
  }

  // Show error if login failed
  //------------------------------------------------
  private showError(err) {
    this.loading.dismiss();
    if (err.status == 401){
      this.showAlert('Oeps!', 'Je email en/of wachtwoord zijn niet juist', 'Ok');
    } else if(err.status == 422) {
      this.showAlert('Oeps!', 'Dit e-mailadres werd al eens gebruikt!', 'Ok');
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

  private goToForgetPassword() {
    this.navCtrl.push(PasswordPage);
  }


  private showLogin() {
    this.showingLogin = true;
  }

  private authTypeChanged(){
    this.formOne.markAsUntouched();
    for( let control in this.formOne.controls){
      this.formOne.controls[control].setValue('');
    }
  }

}
