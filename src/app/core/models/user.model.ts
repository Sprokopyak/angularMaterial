export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  reserved?: {
    cafeId: string,
    approvedBoking: boolean,
    reservedTime: string,
    reservationValidTill: string,
    visitorsNumber: string
  };
  phoneNumber?: number;
  role: 'admin' | 'user';
  selectedCafes: Array<any>;
}
