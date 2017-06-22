import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { tokenNotExpired } from 'angular2-jwt';
import { LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { AuthProvider} from '../../providers/auth/auth';
import { AlertController } from 'ionic-angular';


@Component({
  selector: 'results-modules',
  templateUrl: 'results.html',
})

export class ResultsPage {

  private periods:Array<string> = [
    "Vandaag", "Vandaag & gisteren",
    "Deze week", "Deze maand", "Vorige maand"
  ]
  private currentPeriodIndex:number = 0;
  private results;
  private resultsToShow;
  private loading:any;
  private RESULTS_URL = '/api/getresults';
  // private RESULTS_URL = 'http://curio.vicdenys.be/api/getresults';
  private HEADERS = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public http: Http,
          private auth: AuthProvider, public alertCtrl: AlertController) {
      this.getResults();
  }

  public getPeriod(dir){
    if(dir === 'back'){
      if(this.currentPeriodIndex == this.periods.length - 1){
        this.currentPeriodIndex = 0;
      } else{
        this.currentPeriodIndex ++;
      }
    } else {
      if(this.currentPeriodIndex == 0){
        this.currentPeriodIndex = this.periods.length - 1;
      } else{
        this.currentPeriodIndex --;
      }
    }
  }

  public goToHome(){
    this.navCtrl.pop();
  }

  public showResults(){
    switch(this.periods[this.currentPeriodIndex]){
      case 'Vandaag':
        //this.filterPeriods();
    }
  }

  private filterPeriods(date){

  }

  private getResults(){
    this.showLoader();
    this.http.get(this.RESULTS_URL + '?token=' + this.auth.token ,{ headers: this.HEADERS })
      .map(res => res.json())
      .subscribe(
        data => {
          this.results = data;
          this.loading.dismiss();
        },
        err => {
          this.showAlert('Oeps!', 'Er ging iets mis bij het ophalen van je resultaten. Probeer later opnieuw', 'OK');
        }
      )
  }

  // Show loader modal with custom spinner animation
  //------------------------------------------------
  private showLoader(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Loading Results...</p><img src='./assets/img/icon/loader.svg' alt='loader animation'></div></div>",
    });
    this.loading.present();
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
}
