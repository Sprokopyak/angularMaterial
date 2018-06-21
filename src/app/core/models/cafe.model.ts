export interface Cafe {
  approved: boolean;
  mainImgSrc: any;
  gallery: any;
  cafeName: string;
  phoneNumber: number;
  cafeType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  tables: any;
  freeTables: number;
  description: string;
  id?: string;
  avRating?:number;
}