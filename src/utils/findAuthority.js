import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function findAuthority({ wilaya, daira, baladia, type }) {
  let q = query(
    collection(db, "authorities"),
    where("wilaya", "==", wilaya),
    where("daira", "==", daira),
    where("baladia", "==", baladia),
    where("type", "==", type)
  );
  let docs = await getDocs(q);
  if (!docs.empty) return docs.docs[0].id;

  q = query(
    collection(db, "authorities"),
    where("wilaya", "==", wilaya),
    where("daira", "==", daira),
    where("type", "==", type)
  );
  docs = await getDocs(q);
  if (!docs.empty) return docs.docs[0].id;

  q = query(
    collection(db, "authorities"),
    where("wilaya", "==", wilaya),
    where("type", "==", type)
  );
  docs = await getDocs(q);
  if (!docs.empty) return docs.docs[0].id;

  return null;
}