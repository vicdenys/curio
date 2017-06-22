import { Module } from './Module';

export class SleepModule extends Module{

  public completedOn:string;
  public sleepHours:number = 7;
  public sleepQuality:number = 5;

  constructor(title:string, description:string, repitition:Array<string> = ['no-rep']){
    super(title, description);
    this.moduleType = 'sleep-module';
    this.repitition = repitition;
  }


}
