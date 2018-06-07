import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

@Injectable()
export class CafeService {
  cafeRef: AngularFirestoreCollection<any> = this.afs.collection("cafes");
  tablesRef: AngularFirestoreCollection<any> = this.afs.collection("tables");

  constructor(private afs: AngularFirestore) {}

  pushCafe(obj?: object, arr?: Array<[0]>) {
    this.cafeRef.add(obj).then(docRef => {
      this.cafeRef.doc(docRef.id).update({ cafeId: docRef.id });
      this.tablesRef.doc(docRef.id).set({ tables: arr });
    });
  }
}
