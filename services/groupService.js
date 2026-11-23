
import { db } from '../firebaseConfig';
import { doc, getDoc, query, collection, where, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { getAvailableColor } from '../icons/profileColors';
import { runTransaction } from 'firebase/firestore';

export async function getUserGroups(){
    const userID = auth.currentUser.uid;
    
    
    const groupsQuery = query(
        collection(db, 'Groups'),
        where('members', 'array-contains', userID)
    );

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
    const creatorColor = getAvailableColor();

    try{
        await setDoc( groupRef, {
            createdBy: currentUser,
            groupName: groupName,
            dateCreated: dateCreated,
            inviteCode: inviteCode,
            members: [currentUser],
            memberColors: {
                [currentUser]: creatorColor
            }
        });
        // console.log("group creation successful");

        return groupID
    } catch(error) {
        console.error("Firestore error:", error.code, error.message);
        throw error;
    }
}

export async function joinGroup(joinCode) {
    const currentUser = auth.currentUser?.uid;

    if (!currentUser) {
        throw new Error('User must be signed in.');
    }

    const q = query(
        collection(db, 'Groups'),
        where('inviteCode', '==', joinCode.trim().toUpperCase())
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return 'invalidCode';
    }

    const groupRef = snapshot.docs[0].ref;

    return await runTransaction(db, async (transaction) => {
        const groupDoc = await transaction.get(groupRef);

        if (!groupDoc.exists()) {
            return 'invalidCode';
        }

        const groupData = groupDoc.data();

        if (groupData.members.includes(currentUser)) {
            return 'alreadyMember';
        }

        const memberColors = groupData.memberColors || {};
        const memberColor = getAvailableColor(memberColors);

        transaction.update(groupRef, {
            members: arrayUnion(currentUser),
            [`memberColors.${currentUser}`]: memberColor
        });

        return 'success';
    });
}

export async function generateInviteCode() {
    const array = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P',
        'Q','R','S','T','U','V','W','X','Y','Z',2,3,4,5,6,7,8,9];
    
        let exists;
        
        do {
            let inviteCode = '';
            for (let i = 0; i < 8; i++){
                const random = Math.floor(Math.random() * array.length);
                inviteCode += array[random];
        }
        
        const q = query(
            collection(db, 'Groups'),
            where('inviteCode', '==', inviteCode)
        );

        const snapshot = await getDocs(q);

        exists = !snapshot.empty;
    } while (exists);

    return inviteCode;
}

export async function getGroupColors(groupID) {
    const groupRef = doc(db, 'Groups', groupID);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
        throw new Error("Group not found");
    }

    return groupDoc.data().memberColors || {};
}

export async function getGroupData(groupID) {
    const groupRef = doc(db, 'Groups', groupID);

    const snapshot = await getDoc(groupRef);

    if (!snapshot.exists()) {
        throw new Error('Group not found');
    }
    return {
        id: snapshot.id,
        ...snapshot.data()
    };
}

export async function renameGroup(groupID, newName) {
    const name = newName.trim();

    if(!name) {
        throw new Error('Group name cannot be empty!');
    }
    
    const groupRef = doc(db, 'Groups', groupID);

    await updateDoc(groupRef, {
        groupName: name
    });
}

export async function leaveGroup(groupID) {
    const currentUser = auth.currentUser?.uid;

    if (!currentUser) {
        throw new Error("User must be signed in")
    }

    const groupRef = doc(db, 'Groups', groupID);

    await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(groupRef);

        if (!snapshot.exists()) {
            throw new Error('Group not found');
        }

        const groupData = snapshot.data();

        const updatedMembers = groupData.members.filter(
            id => id !== currentUser
        );

        const updatedColors = {
            ...(groupData.memberColors || {})
        };

        delete updatedColors[currentUser];

        transaction.update(groupRef, {
            members: updatedMembers,
            memberColors: updatedColors
        });
    });
}


