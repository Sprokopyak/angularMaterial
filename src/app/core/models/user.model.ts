export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  reserved?: {
    cafeId: string,
    tableIndex: number
  };
  role: 'admin' | 'user';
}
