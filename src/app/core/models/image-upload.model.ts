export class Upload {

  $key: string;
  file:File;
  name:string;
  url:string;
  urls: object;
  progress:number;
  createdAt: Date = new Date();

  constructor(file:File) {
    this.file = file;
  }
}