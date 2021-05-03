import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ReadModule } from '../../classes/ReadModule';
import { SleepModule } from '../../classes/SleepModule';
import { MoodModule } from '../../classes/MoodModule';
import { Module } from '../../classes/Module';
import { AuthProvider} from '../../providers/auth/auth';
import 'rxjs/add/operator/map';
import {DomSanitizer} from '@angular/platform-browser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

/*
  Generated class for the ModuleProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ModuleProvider {

  // private READMODULES_URL = '/api/modules';
  // private SLEEP_URL = '/api/savesleepresult';
  // private MOOD_URL = '/api/savemoodresult';
  // private MOOD_IMAGE_URL = '/api/savemoodphoto';
  // private READMODULES_URL = 'http://curio.vicdenys.be/api/modules';
  // private SLEEP_URL = 'http://curio.vicdenys.be/api/savesleepresult';
  // private MOOD_URL = 'http://curio.vicdenys.be/api/savemoodresult';
  // private MOOD_IMAGE_URL = 'http://curio.vicdenys.be/api/savemoodphoto';
  private READMODULES_URL = 'http://curio-vicdenys.c9users.io/api/modules';
  private SLEEP_URL = 'http://curio-vicdenys.c9users.io/api/savesleepresult';
  private MOOD_URL = 'http://curio-vicdenys.c9users.io/api/savemoodresult';
  private MOOD_IMAGE_URL = 'http://curio-vicdenys.c9users.io/api/savemoodphoto';
  private HEADERS = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  public modules:Array<Module> = [];
  public modulesAreLoading:boolean = false;

  constructor(public http: Http, private auth: AuthProvider, private sanitize: DomSanitizer,  private transfer: Transfer,
       private file: File) {}


  public getReadModules(modules){
    if(!modules.length){

      return new Promise(
        (resolve, reject) => {
          this.http.get(this.READMODULES_URL + '?token=' + this.auth.token, { headers: this.HEADERS })
            .map(res => res.json())
            .subscribe(
              data => {

                let readMod = JSON.parse(data);

                for(let mod in readMod){
                  let newMod = new ReadModule(readMod[mod].title, readMod[mod].description, readMod[mod].content );
                  newMod.content = this.sanitize.bypassSecurityTrustHtml(newMod.content);
                  modules.push(newMod);
                }

                console.log(modules);
                resolve(data);
              },
              err => {
                reject(err);
              }
            )
        }
      )
    }
  }

  public initSleepModule(){
    return new SleepModule('Slaapmeter', 'Deze module helpt je bij het bijhouden van je slaap. Dan kunnen we dit linken aan je stemming');
  }

  public initMoodModule(){
    return new MoodModule('Stemmings meter', 'Deze module vraagt naar je stemming. Doe dit dagelijks en je krijgt een overzicht over je stemmingspatroon en zijn invloeden')
  }

  public saveSleepModule(module){
    let mod = {
      hours: module.sleepHours,
      quality: module.sleepQuality,
    }
    return new Promise(
      (resolve, reject) => {
        this.http.post(this.SLEEP_URL + '?token=' + this.auth.token, mod ,{ headers: this.HEADERS })
          .map(res => res.json())
          .subscribe(
            data => {
              resolve(data);
            },
            err => {
              reject(err);
            }
          )
      }
    )
  }

  public saveMoodModule(module){

    return new Promise(
      (resolve, reject) => {
        this.http.post(this.MOOD_URL + '?token=' + this.auth.token, module ,{ headers: this.HEADERS })
          .map(res => res.json())
          .subscribe(
            data => {
              this.uploadMoodImage(module, data.result_id, data.user_id).then(data => resolve(data), err => reject(err));
              resolve(data);
            },
            err => {
              reject(err);
            }
          )
      }
    )
  }

  // Always get the accurate path to your apps folder
    public pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        return this.file.dataDirectory + img;
      }
    }

  public uploadMoodImage(module, resultID, userID){
    let options = {
      fileKey: "file",
      fileName: 'moodPhoto',
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': 'moodPhoto', 'mood_id': resultID, 'user_id': userID}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return new Promise(
      (resolve, reject) => {
        console.log(this.pathForImage(module.image));
        console.log(module.image);
        fileTransfer.upload(this.pathForImage(module.image), this.MOOD_IMAGE_URL + '?token=' + this.auth.token, options).then(data => {
          console.log(data);
          resolve(data);
        }, err => {
          console.log(err);
          reject(err);
        });
      });

  }

}
