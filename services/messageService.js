
import { collection, doc, setDoc, getDocs, query, 
    where, orderBy, serverTimestamp, } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL,} from 'firebase/storage';
import {db, storage } from '../firebaseConfig';
import { createUser } from './userService';

  export async function writeMessage(recordingUri, groupID, duration) {
    if (!recordingUri) {
        throw new Error('No recording available to send.');
    }
    
    const senderID = await createUser();

    const time = new Date();
    const timeSent = time.toLocaleTimeString();
    const dateSent = time.toLocaleDateString();
    
    const messageRef = doc(collection(db, "messages")) ;
    const messageID = messageRef.id;
    
    const storagePath = `voice-messages/${groupID}/${messageID}.m4a`;
    const audioRef = ref(storage, storagePath);

    const response = await fetch(recordingUri);
    const blob = await response.blob();
    
    await uploadBytes(audioRef, blob, {
      contentType: "audio/mp4",
    });
    
    const audioURL = await getDownloadURL(audioRef);

    console.log("audio uploaded, about to write to firestore...");
    console.log("Document path:", messageRef.path);


    try{
    await setDoc(messageRef, {
      audioURL: audioURL,
      duration: duration,
      groupID: groupID,
      senderID: senderID,
      timeSent: timeSent,
      dateSent: dateSent,
      createdAt: serverTimestamp()
    });
    
    console.log("firestore write successful");

    return messageID;

  } catch(error) {
    console.error("Firestore error:", error.code, error.message);
  }
}

export async function loadMessages(groupID) {
  try {
    await createUser();

    const messageQuery = query(
    collection(db, 'messages'),
    where('groupID', '==', groupID),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(messageQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data()
  }));
} catch (error) {
  console.error('Error loading messages:', error.code, error.message)
}
}

