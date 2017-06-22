

export class Module {

  public title:string;
  public description:string;
  public completedOn:string;
  public repitition:Array<string>;
  public showContent:boolean = false;
  public moduleType:string;

  constructor(title:string, description:string) {
    this.title = title;
    this.description = description;
  }


}
