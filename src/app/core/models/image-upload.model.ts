export class Upload {
  $key: string;
  file:File;
  name:string;
  url:string;
  fullPath: string;
  progress:number;
  thumbnailUrl: string;
  thumbnailPath: string;

  constructor(file:File) {
    this.file = file;
  }
}