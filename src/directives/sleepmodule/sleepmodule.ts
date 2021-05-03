import { Component, Input } from '@angular/core';
import { Module } from '../../classes/Module';
import { SleepModule} from '../../classes/SleepModule';
import { LoadingController } from 'ionic-angular';
import { ModulesPage } from '../../pages/modules/modules';
import { ModuleProvider } from '../../providers/module/module';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the SleepmoduleDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Component({
  selector: '[sleepmodule]',
  templateUrl: 'sleepmodule.html',
  inputs: ['module', 'isOnSeconPage']
})
export class SleepmoduleDirective {

  public module:SleepModule;
  private loading: any;
  private success: any;
  private AMOUNTMINMAX = {min: 0, max: 15}
  private QUALITYMINMAX = {min: 0, max: 10}
  private backgroundPosFaceSleepSprite:number = 1276 - 5 * 116;

  constructor(private modulesPage: ModulesPage, private moduleProv: ModuleProvider, private loadingCtrl: LoadingController,
        public alertCtrl: AlertController) {
    console.log('Hello SleepmoduleDirective Directive');
  }

  // Show loader modal with custom spinner animation
  //------------------------------------------------
  private showLoader(){
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Saving</p><img src='./assets/img/icon/loader.svg' alt='loader animation'></div></div>",
    });
    this.loading.present();
  }

  public nextWrapper(){
    let wrapperCount = document.getElementById('wrapperbox').childElementCount;
    console.log(this.modulesPage.wrapperIndex);
    if (wrapperCount <= this.modulesPage.wrapperIndex){
      this.submitResult();
    } else {
      this.modulesPage.wrapperIndex ++;
    }

    this.updateSprites(this.module.sleepQuality);
  }

  private showSuccess(){
    this.success = this.loadingCtrl.create({
      spinner: 'hide',
      content: "<div class='custom-spinner-container'><div class='custom-spinner-box'><p>Resultaat toegevoegd</p><img src='./assets/img/icon/success.svg' alt='success icon'></div></div>",
    });
    this.success.present();
    setTimeout(() => {
      this.success.dismiss();
    }, 2000);
  }

  public submitResult(){
      this.showLoader();
      this.moduleProv.saveSleepModule(this.module).then(
        data => {
          this.loading.dismiss();
          this.showSuccess();
          this.modulesPage.slideChanged();
          console.log(data);
        }
      ).catch(
        err => {
          this.loading.dismiss();
          this.showAlert('Oeps!', 'Server momenteel onbereikbaar. Probeer later opnieuw!', 'Ok');
          console.log(err);
        }
      );
  }

  private updateSprites(x){
      this.backgroundPosFaceSleepSprite = 1276 - x * 116;
  };

  public adjustQuality(mp){
    if(mp=='+' && this.module.sleepQuality < this.QUALITYMINMAX.max){
        this.module.sleepQuality ++;
    } else if (mp== '-' && this.module.sleepQuality > this.QUALITYMINMAX.min){
       this.module.sleepQuality --;
    }
    this.updateSprites(this.module.sleepQuality);
  }

  public adjustAmount(mp){
    if(mp=='+' && this.module.sleepHours < this.AMOUNTMINMAX.max){
        this.module.sleepHours ++;
    } else if (mp== '-' && this.module.sleepHours > this.AMOUNTMINMAX.min){
       this.module.sleepHours --;
    }


  }

  public deleteImg(module){
    module.image = "";
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
