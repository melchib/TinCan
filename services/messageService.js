
import { collection, doc, setDoc, getDocs, query, 
    where, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL,} from 'firebase/storage';
import {db, storage } from '../firebaseConfig';
import { createUser, getDisplayName } from './userService';

  export async function writeMessage(recordingUri, groupID, duration) {
    if (!recordingUri) {
        throw new Error('No recording available to send.');
    }
    
    const senderID = await createUser();

    const time = new Date();
    const timeSent = time.toLocaleTimeString();
    const dateSent = time.toLocaleDateString();
    
    const messageRef = doc(collection(db, "Groups", groupID, "messages")) ;
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
    const messageQuery = query(
    collection(db, 'Groups', groupID, 'messages'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(messageQuery);

  const messages = await Promise.all(
    snapshot.docs.map(async (document) => {
      const message = document.data();
      const displayName = await getDisplayName(message.senderID);

  return {
      id: document.id,
      ...message,
      displayName: displayName
      };
    })
  );

  return messages;

  } catch (error) {
      console.error('Error loading messages:', error.code, error.message);
      throw error;
    }
}