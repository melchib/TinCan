
import { db } from '../firebaseConfig';
import { doc, getDoc, query, collection, where, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

export async function getUserGroups(){
    const userID = auth.currentUser.uid;
    
    
    const groupsQuery = query(
        collection(db, 'Groups'),
        where('members', 'array-contains', userID)
    );

    // console.log("Current auth UID:", auth.currentUser?.uid);
    // console.log("Query userID:", userID);
    // console.log(
    // "UIDs match:",
    // auth.currentUser?.uid === userID
    // );
    const snapshot = await getDocs(groupsQuery);
   

    const groups =
        snapshot.docs.map((groupDocument) => ({
        id: groupDocument.id,
        ...groupDocument.data()
    }));

    return groups;
}

export async function writeNewGroup(currentUser, groupName, inviteCode){
    const dateCreated = serverTimestamp();
    const groupRef = doc(collection(db, "Groups"));
    const groupID = groupRef.id;

    // console.log("Authenticated UID:", auth.currentUser?.uid);
    // console.log("currentUser argument:", currentUser);
    // console.log("UIDs match:", currentUser === auth.currentUser?.uid);

    // console.log("Group name:", groupName);
    // console.log("Group name length:", groupName?.length);

    // console.log("Invite code:", inviteCode);
    // console.log("Invite code length:", inviteCode?.length);

    // console.log(
    // "Invite code valid:",
    // /^[A-HJ-NP-Z2-9]{8}$/.test(inviteCode)
    // );
    try{
        await setDoc( groupRef, {
            createdBy: currentUser,
            groupName: groupName,
            dateCreated: dateCreated,
            inviteCode: inviteCode,
            members: [currentUser],
        });
        // console.log("group creation successful");

        return groupID
    } catch(error) {
        console.error("Firestore error:", error.code, error.message);
        throw error;
    }
}

export async function joinGroup(joinCode) {
    const  q = query(
        collection(db, "Groups"),
        where("inviteCode", "==", joinCode.trim().toUpperCase())
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty){
        return "invalidCode";
    }

    const groupDoc = snapshot.docs[0];
    const groupID = groupDoc.id;

    const groupData = groupDoc.data();
    const currentUser = auth.currentUser.uid;

    if (groupData.members.includes(currentUser)){
        return "alreadyMember";
    }

    const groupRef = doc(db, "Groups", groupID);

    await updateDoc(groupRef, {
        members: arrayUnion(currentUser)
    });
    return "success";
}

export  function generateInviteCode() {
    const array = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P',
        'Q','R','S','T','U','V','W','X','Y','Z',2,3,4,5,6,7,8,9];
    let inviteCode = '';
    for (let i = 0; i < 8; i++){
        const random = Math.floor(Math.random() * array.length);
        inviteCode += array[random];
    }
    // console.log(inviteCode)
    return inviteCode;
}