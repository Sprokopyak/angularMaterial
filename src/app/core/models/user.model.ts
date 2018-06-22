export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  reserved?: {
    cafeId: string,
    approvedBoking: boolean,
    reservedTime: string,
    reservationValidTill: string
  };
  role: 'admin' | 'user';
}
