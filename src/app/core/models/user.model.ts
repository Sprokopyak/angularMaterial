import { callNgModuleLifecycle } from "@angular/core/src/view/ng_module";

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  role: 'admin' | 'user';
}
