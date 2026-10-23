
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';

export async function createUser() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const user = auth.currentUser;
  console.log("Current user UIS:", user?.uid);

  if (!user) {
    throw new Error("User authentication failed");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      createdAt: new Date(),
      displayName: "Test User",
    });
  }

  return user.uid;
}
export async function signUp(email, password) {
  const result = await createUserWithEmailAndPassword(
    auth, email, password
  );
  return result.user;
}

export async function signIn(email, password) {
  const result = await signInWithEmailAndPassword(
    auth, email, password
  );
  return result.user;
}
export async function logOut() {
  await signOut(auth);
}