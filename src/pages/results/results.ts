import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
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
    "Deze week", "Deze maand"
  ]
  private currentPeriodIndex:number = 0;
  private results:Array<any> = [];
  private sleepResults:Array<any> = [];
  private resultsToShow:Array<any>;
  private selectedResult;
  private loading:any;
  private isLoading:boolean = false;
  private moodresultsLoading:boolean = false;
  private sleepresultsLoading:boolean = false;
  private showingSleepResults:boolean = false;
  public showBigImage:boolean = false;
  public showImageLoader:boolean = true;
  public imgURl:string = './assets/img/icon/loader.svg';
  private RESULTS_URL = '/api/getresults';
  private SLEEPRESULTS_URL = '/api/getsleepresults';
  private IMAGE_URL = '/api/storage';
  // private RESULTS_URL = 'http://curio.vicdenys.be/api/getresults';
  // private SLEEPRESULTS_URL = 'http://curio.vicdenys.be/api/getsleepresults';
  // private IMAGE_URL = 'http://curio.vicdenys.be/api/storage'
  // private RESULTS_URL = 'http://curio-vicdenys.c9users.io/api/getresults';
  // private SLEEPRESULTS_URL = 'http://curio-vicdenys.c9users.io/api/getsleepresults';
  // private IMAGE_URL = 'http://curio-vicdenys.c9users.io/api/storage'
  private HEADERS = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public http: Http,
          private auth: AuthProvider, public alertCtrl: AlertController) {
      if (!this.results.length){
        this.isLoading = true;
        this.getResults();
        this.getSleepResults();
      }
  }

  public slideChanged(){
    let currentIndex = this.slides.getActiveIndex();
    this.showingSleepResults = false;

    if(currentIndex == 1){
      this.showingSleepResults = true;
    }
  }

  public getPeriod(dir){
    if(dir == 'back'){
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

    this.showResults();
  }

  public goToHome(){
    this.navCtrl.pop();
  }

  public showResults(){
    let date = new Date();
    switch(this.periods[this.currentPeriodIndex]){
      case this.periods[0]:
        this.filterPeriods(date.setDate(date.getDate()));
        break;
      case this.periods[1]:
        this.filterPeriods(date.setDate(date.getDate() - 1));
        break;
      case this.periods[2]:
        this.filterPeriods(date.setDate(date.getDate() - 7));
        break;
      case this.periods[3]:
        this.filterPeriods(date.setDate(date.getDate() - 31));
        break;
      default:
    }
  }

  private filterPeriods(date){
    let d = new Date(date);
    d.setHours(0,0,0,0);

    this.resultsToShow = [];

    for(let result in this.results){
      let dateResult = new Date(this.results[result].created_at);
      if(dateResult >= d){
        this.resultsToShow.push(this.results[result]);
      }
    }

    if(this.resultsToShow.length){
        this.selectResult(this.resultsToShow[0].id);
    } else {
      this.selectedResult = [];
    }
  }

  private getResults(){
    this.moodresultsLoading = true;
    this.http.get(this.RESULTS_URL + '?token=' + this.auth.token ,{ headers: this.HEADERS })
      .map(res => res.json())
      .subscribe(
        data => {
          this.results = data;
          this.moodresultsLoading = false;
          this.checkIfLoading();
        },
        err => {
          this.showAlert('Oeps!', 'Er ging iets mis bij het ophalen van je resultaten. Probeer later opnieuw', 'OK');
        }
      )
  }
  private getSleepResults(){
    this.sleepresultsLoading = true;
    this.http.get(this.SLEEPRESULTS_URL + '?token=' + this.auth.token ,{ headers: this.HEADERS })
      .map(res => res.json())
      .subscribe(
        data => {
          this.sleepResults = data;
          this.sleepresultsLoading = false;
          this.checkIfLoading();
          console.log(this.sleepResults);
        },
        err => {
          this.showAlert('Oeps!', 'Er ging iets mis bij het ophalen van je resultaten. Probeer later opnieuw', 'OK');
        }
      )
  }

  private processSleepResults(){
    for(let result in this.results){
        let rDate = new Date(this.results[result].created_at)
        let rTommorow = new Date(rDate.setDate(rDate.getDate() + 1));
        let rYesterday = new Date(rDate.setDate(rDate.getDate() - 1));
        rTommorow.setHours(23,59,59,999);
        rYesterday.setHours(0,0,0,0);

        let resultsAround:Array<any> = [];

        for (let sleepResult in this.sleepResults){

          let sDate = new Date(this.sleepResults[sleepResult].completed);

          if(sDate <= rTommorow && sDate >= rYesterday) {
            resultsAround.push(this.sleepResults[sleepResult]);
          }
        }

        let sleepAmountAvarage = 0;
        let sleepQualityAvarage = 0;
        let dataCounter = 0
        for (let ra in resultsAround){
          sleepAmountAvarage += resultsAround[ra].hours;
          sleepQualityAvarage += resultsAround[ra].quality;
          dataCounter++;
        }

        this.results[result].sleep = {
          'hours' : sleepAmountAvarage / dataCounter,
          'quality' : sleepQualityAvarage /dataCounter
        }
    }

    console.log(this.results);
  }

  private selectResult(id){
    this.selectedResult = this.getResultById(id);
    console.log(this.selectedResult);

    this.changeImg(id);
  }

  private changeImg(mood_id){
    this.showImageLoader = true;

    this.imgURl = this.IMAGE_URL + '/' + mood_id + '?token=' + this.auth.token;

    let imageobj = document.getElementById('mood_image');

    let bigO = this;

    imageobj.addEventListener('load', function() {
          bigO.showImageLoader = false;
    }, false);

    imageobj.addEventListener('error', function() {
          bigO.showImageLoader = false;
    }, false);

  }

  private getResultById(id){
    for(let result in this.results){
      if(this.results[result].id == id){
        return this.results[result];
      }
    }
  }

  private checkIfLoading(){
    if(!this.sleepresultsLoading && !this.moodresultsLoading){
      this.isLoading = false;
      this.showResults();
      this.processSleepResults();
    }
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
