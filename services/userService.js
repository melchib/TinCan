
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebaseConfig';

export async function createUser() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const user = auth.currentUser;

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
