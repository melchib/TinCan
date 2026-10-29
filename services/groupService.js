
import { db } from '../firebaseConfig';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

export async function getUserGroups(userID){
    const groupsQuery = query(
        collection(db, 'Groups'),
        where('members', 'array-contains', userID)
    );

    const snapshot = await getDocs(groupsQuery);
    console.log('Collection queried: Groups');
    console.log('User ID searched:', userID);
    console.log('Matching documents:', snapshot.size);
    console.log('Document data:', snapshot.docs.map(doc => doc.data()));

    console.log('matching groups', snapshot.size);


    const groups =snapshot.docs.map((groupDocument) => ({
        id: groupDocument.id,
        ...groupDocument.data()
    }));

    return groups;
}