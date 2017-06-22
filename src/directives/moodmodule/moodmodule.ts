import { Component, Input } from '@angular/core';
import { Module } from '../../classes/Module';
import { MoodModule } from '../../classes/MoodModule';
import { ModuleProvider } from '../../providers/module/module';
import { ModulesPage } from '../../pages/modules/modules';
import { ActionSheetController } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { AlertController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the MoodmoduleDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
declare var cordova: any;

@Component({
  selector: '[moodmodule]',
  templateUrl: 'moodmodule.html',
  inputs: ['module', 'isOnSeconPage'] // Attribute selector
})
export class MoodmoduleDirective {

  public module:MoodModule;
  private lastImage: string = null;
  private loading: any;
  private success: any;

  private imagePickerOptions = {
    maximumImagesCount: 1,
    width: 500,
    height: 500,
    quality: 75
  }


  constructor(private modulesPage: ModulesPage, public actionSheetCtrl: ActionSheetController, private photoLibrary: PhotoLibrary,
      private alertCtrl: AlertController, private imagePicker: ImagePicker, private camera: Camera,
      private diagnostic: Diagnostic, private file: File, private moduleProv: ModuleProvider,  private loadingCtrl: LoadingController) {

  }

  public nextWrapper(){
    let wrapperCount = document.getElementById('wrapperbox').childElementCount;
    console.log(this.modulesPage.wrapperIndex);
    if (wrapperCount <= this.modulesPage.wrapperIndex){
      this.submitResult();
    } else {
      this.modulesPage.wrapperIndex ++;
    }
  }

  public graphTouchEnd(event){
    // Enable backslide
    this.modulesPage.draggingGraph = false;
    // Enable slideChange
    this.modulesPage.slides.lockSwipes(false);
    let ind = document.getElementById('indicator');
    ind.style.width = '1.1em';
    ind.style.height = '1.1em';
  }

  public graphTouchMove(event){
    this.drawIndicator(event);
  }

  public graphTouchStart(event){
    let ind = document.getElementById('indicator');
    ind.style.width = '1.5em';
    ind.style.height = '1.5em';

    this.drawIndicator(event);

    // Disable backslide
    this.modulesPage.draggingGraph = true;
    // Disable slideChange
    this.modulesPage.slides.lockSwipes(true);
  }

  public getWrapperIndex(){

  }

  public drawIndicator(event){
    let graph = document.getElementById('graph').getBoundingClientRect();

    let x = event.touches[0].pageX - graph.left <0 ? 0: event.touches[0].pageX - graph.left;
    let y = event.touches[0].pageY - graph.top <0 ? 0: event.touches[0].pageY - graph.top;


    x = Math.round(x / graph.width * 100);
    y = Math.round(y / graph.height * 100);

    x = x>100 ? 100: x;
    y = y>100 ? 100: y;

    //change indicator
    let ind = document.getElementById('indicator');
    ind.style.top = y+ '%';
    ind.style.left = x + '%';

    this.module.moodCoord = [x,y];
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Kies een foto van...',
      buttons: [
        {
          text: 'Fotobibliotheek',
          handler: () => {
            this.choosePhotoFromLib();
          }
        },{
          text: 'Camera',
          handler: () => {
            this.checkCameraAuthAndTakePicture();
          }
        },{
          text: 'Annuleer',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  private choosePhotoFromLib(){
    this.photoLibrary.requestAuthorization().then(() => {
        this.takePictureWithCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
    }).catch(err => this.showAlert('Geen toegang', 'U moet deze app toegang verlenen tot uw bibliotheek. Ga naar de isntellingen van uw Iphone', 'OK') );
  }

  private checkCameraAuthAndTakePicture(){
    this.diagnostic.isCameraAuthorized().then((autherized) => {
      if (autherized){
        this.takePictureWithCamera(this.camera.PictureSourceType.CAMERA);
      } else {
        this.diagnostic.requestCameraAuthorization().then((status) => {
          if (status == this.diagnostic.permissionStatus.GRANTED){
            this.takePictureWithCamera(this.camera.PictureSourceType.CAMERA);
          } else {
            this.showAlert('Geen toegang', 'U moet deze app toegang verlenen tot uw Camera. Ga naar de instellingen van uw Iphone', 'OK');
          }
        })
      }
    })
  }

  // Get the data of an image from camera
  private takePictureWithCamera(sourceType){

      let cameraOptions: CameraOptions = {
        quality: 30,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
      }

    this.camera.getPicture(cameraOptions).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     let currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
     let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
     this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
     this.showAlert('Oeps!', 'Er ging iets mis met het openen van de camera. Probeer later opnieuw', 'OK');
    });
  }


  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.module.image = newFileName;
    }, error => {
      console.log(error);
      this.showAlert('Oeps!','Fout bij het opslagen', 'OK');
    });
  }

  public submitResult(){
    this.showLoader();

    let ind = document.getElementById('indicator');
    let x = parseInt(ind.style.top);
    let y = parseInt(ind.style.left);

    this.module.moodCoord = [x,y];

    this.moduleProv.saveMoodModule(this.module).then(
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

  private showAlert(title: string, subtitle: string, btnTxt: string) {
    let alert = this.alertCtrl.create({
        title: title,
        subTitle: subtitle,
        buttons: [btnTxt]
      });
    alert.present();
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

}
