export interface Cafe {
  approved: boolean;
  mainImgSrc: any;
  gallery: any;
  cafeName: string;
  cafeType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
}