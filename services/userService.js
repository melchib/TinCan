
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
export async function signUp(displayName, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth, email.trim(), password
  );
  const user = userCredential.user;

  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    displayName: displayName.trim(),
    createdAt: serverTimestamp(),
  });
  return user;
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth, email.trim(), password
  );
  return userCredential.user;
}
export async function logOut() {
  await signOut(auth);
}