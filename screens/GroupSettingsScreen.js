import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native"
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard'
import { auth } from "../firebaseConfig";
import { getGroupData, renameGroup, leaveGroup } from "../services/groupService";
import ProfileIcon from "../components/ProfileIcon";
import { getDisplayName } from "../services/userService";
import { Feather } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';


export default function GroupSettingsScreen({ navigation, route }) {
    const { groupID } = route.params;

    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const currentUser = auth.currentUser?.uid;
    const isCreator = groupData?.createdBy === currentUser;

    function confirmGroupRename() {
        if (!newGroupName.trim()) {
            Alert.alert('Error', 'Group name cannot be empty!');
            return;
        }
        
        Alert.alert(
            'Rename group', `Are you sure you want to rename this group to "${newGroupName.trim()}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Confirm',
                    onPress: handleRenameGroup
                }
            ]
        );
    }
    
    async function handleRenameGroup() {
        try { 
            await renameGroup(groupID, newGroupName);
            setGroupData(previous => ({
                ...previous,
                groupName: newGroupName.trim()
            }));

            setIsEditing(false);

            Alert.alert('Success', 'Group name updated!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    function confirmLeaveGroup() {
        Alert.alert('Leave Group', `Are you sure you want to leave group "${groupData?.groupName}"`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Leave group',
                    style: 'destructive',
                    onPress: handleLeaveGroup
                }
            ]
        );
    }

    async function handleLeaveGroup() {
        try {
            await leaveGroup(groupID);
            navigation.popToTop();
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    useFocusEffect(
        useCallback(() => {
            let active = true;
            async function loadGroupSettings() {

                try {
                    const data = await getGroupData(groupID);
                    

                    const memberDetails = await Promise.all(
                        data.members.map(async (userID) => {
                            const displayName = await getDisplayName(userID);
                            

                            return {
                                id: userID,
                                displayName: displayName,
                                color: data.memberColors?.[userID]
                            };
                        })
                    );

                    if (active) {
                        setGroupData(data);
                        setMembers(memberDetails);
                        setNewGroupName(data.groupName);
                    }
                } catch (error) {
                    console.error('Error loading group settings:', error)
                }
            }

            loadGroupSettings();

            return () => {
                active = false;
            };
        }, [groupID])
    );

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Group Settings</Text>
            <View style={styles.backButton}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                     <Octicons name="arrow-left" size={32} color="#743f43" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Group Name</Text>
                
                {!isEditing && (
                <View style={styles.editNameRow}>
                    <Text style={styles.value}>{groupData?.groupName}</Text>
                    <TouchableOpacity 
                        style={styles.sideBtn}
                        onPress={() => setIsEditing(true)}>
                            <Feather name="edit-2" size={18} color="#743f43" />
                        </TouchableOpacity>
                </View>
                )}

                {isEditing && (
                <View style={styles.editNameRow}>
                    <TextInput
                    style={[styles.value, styles.nameInput]}
                        value={newGroupName}
                        onChangeText={setNewGroupName}
                        placeholder={groupData?.groupName}
                    />
                
                <TouchableOpacity
                    style={styles.sideBtn}
                    onPress={confirmGroupRename}
                >
                    <Feather name="check" size={22} color="#743f43" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setNewGroupName(groupData?.groupName || '');
                        setIsEditing(false);
                    }}
                >
                    <Feather name="x" size={22} color="#743f43" />
                </TouchableOpacity>
                </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Invite Code</Text>
                <View style={styles.editNameRow}>
                <Text style={styles.value}>
                    {groupData?.inviteCode}
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        if (groupData?.inviteCode) {
                            Clipboard.setStringAsync(groupData.inviteCode);
                        }
                    }}
                    >
                        <Feather name="copy" size={24} color="#743f43" />
                    </TouchableOpacity>
                    </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>
                    Members ({members.length})
                </Text>

                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.memberRow}>
                            <ProfileIcon
                                displayName={item.displayName}
                                color={item.color}
                                size={45}
                            />

                            <Text style={styles.memberName}>
                                {item.displayName}
                            </Text>
                            
                        </View>
                    )}
                />
            </View>

            <TouchableOpacity style={styles.leaveButton}
            onPress={confirmLeaveGroup}>
                <Text style={styles.leaveText}>
                    Leave Group
                </Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffada8',
        paddingTop: 90,
        paddingHorizontal: 25
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30
    },
    section: {
        backgroundColor: '#f8f4ee',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        gap: 12,
    
    },
    label: {
        fontSize: 16,
        color: '#743f43'
    },
    value: {
        fontSize: 22,
        color: '#743f43',
        fontWeight: 'bold'
    },
    editNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },
    nameInput: {
        flex: 1,
        minWidth: 0
    },
    sideBtn: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 15
    },

    memberName: {
        fontSize: 18,
        color: '#743f43',
        fontWeight: '500',
        flex: 1
    },
    leaveButton: {
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#ef2a20'
    },
    leaveText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
    position: 'absolute',
    top: 85,
    height: 50,
    width: 50,
    left: 15,
    backgroundColor: '#fb6058',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300
},
    
});