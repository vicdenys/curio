import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { AuthProvider} from '../../providers/auth/auth';
import { ModuleProvider } from '../../providers/module/module'
import { Module } from '../../classes/Module';
import { tokenNotExpired } from 'angular2-jwt';
import { LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-modules',
  templateUrl: 'modules.html',
})
export class ModulesPage {

  public contentShowing:boolean = false;
  public draggingGraph:boolean = false;
  public currentIndex:number = 1;
  public isAtTop:boolean = true;
  public isOnSecondPage:boolean = false;
  public moodIsActive:string = '';
  private loading:any;
  public wrapperIndex:number =  1;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, private auth: AuthProvider, private moduleProv: ModuleProvider,
          private loadingCtrl: LoadingController) {
    if(!moduleProv.modules.length){
      if(!moduleProv.modulesAreLoading){
        moduleProv.modulesAreLoading = true;
        moduleProv.getReadModules(moduleProv.modules).then(data => {
          moduleProv.modules.splice(0, 0, moduleProv.initSleepModule());
          moduleProv.modules.splice(0, 0, moduleProv.initMoodModule());
          this.updateModuleCount();

          moduleProv.modulesAreLoading = false;
        });
      }
    } else {
      // Check active module for home icon display
      this.checkActiveModule();
    }
  }

  ionViewCanEnter(): boolean{
    return tokenNotExpired(null, this.auth.token);
  }

  goToHome() {
    this.slideChanged();
    this.navCtrl.pop();
  }

  public openContent(module){
    module.showContent = true;
    this.contentShowing = true;
  }

  public slideChanged(){
    for(let module in this.moduleProv.modules){
      if(this.moduleProv.modules[module].showContent){
        this.moduleProv.modules[module].showContent = false;
      }
    }
    this.wrapperIndex = 1;
    this.contentShowing = false;
    this.isOnSecondPage = false;
    this.updateModuleCount();

  }

  public doRefresh(refresher) {
      this.slideChanged();
      refresher.complete();
  }

  public updateModuleCount(){
    this.currentIndex = this.slides.getActiveIndex() + 1;
    if(this.currentIndex > this.moduleProv.modules.length){
      this.currentIndex = this.moduleProv.modules.length;
    }

    // Check active module for home icon display
    this.checkActiveModule();
  }

  public slideScrolled(ev){
    if(ev.target.scrollTop <= 0){
      this.isAtTop = true;
    } else {
      this.isAtTop = false;
    }
  }

  private checkActiveModule(){
    if(this.moduleProv.modules.length){
      if(this.moduleProv.modules[this.currentIndex - 1].moduleType == 'mood-module'){
        this.moodIsActive = 'mood-module';
      } else if(this.moduleProv.modules[this.currentIndex - 1].moduleType == 'sleep-module') {
        this.moodIsActive = 'sleep-module';
      } else {
        this.moodIsActive = '';
      }
    }

  }

  // Show loader modal with custom spinner animation
  //------------------------------------------------
  private showLoader(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Loading Modules...</p><img src='./assets/img/icon/loader.svg' alt='loader animation'></div></div>",
    });
    this.loading.present();
  }


}
