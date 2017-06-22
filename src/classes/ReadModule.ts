import { Module } from './Module';

export class ReadModule extends Module{

  public content:any;

  constructor(title:string, description:string, content:any,repitition:Array<string> = ['no-rep']){
    super(title, description);
    this.repitition = repitition;
    this.moduleType = 'read-module'; 
    this.content = content
  }


}
