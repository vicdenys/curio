import { Module } from './Module';

export class MoodModule extends Module{

  public completedOn:string;
  public moodCoord:Array<number>;
  public moodText:string;
  public image:string = "";

  constructor(title:string, description:string, repitition:Array<string> = ['no-rep']){
    super(title, description);
    this.moduleType = 'mood-module';
    this.repitition = repitition;
  }


}
