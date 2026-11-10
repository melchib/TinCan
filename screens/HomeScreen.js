import { useEffect, useState } from 'react';
import { View,Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getUserGroups } from '../services/groupService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function HomeScreen({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function refreshGroups() {
                const user = auth.currentUser;

                if (!user) return;
                
                try {
                    const userGroups = await getUserGroups(user.uid);
                    setGroups(userGroups);
                } catch (error) {
                    console.log("Error refreshing groups:", error);
                }
            }

            refreshGroups();
        }, [])
    )

    function handleAddButtonPress(){
        if (isVisible) { 
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user){
                setGroups([]);
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setErrorMessage('');

                const userGroups = await getUserGroups(user.uid);

                console.log('Logged-in UID:', user.uid);
                console.log('Groups returned from Firebase:', userGroups);

                setGroups(userGroups);
            } catch (error) {
                console.log('Groups error code:', error.code);
                console.log('Groups error message:', error.message);
            } finally {
                setIsLoading(false);
            }
        });
        return unsubscribe
    }, []);
    
    return(
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <LinearGradient
                colors={['#f7eaea', '#f97c75']}
                style={styles.background}
                />
                <Image 
                    source={require('../icons/tincanlogo.png')}
                    style={{ left: 15, top:-40, width: 250, height: 250 }}
                    resizeMode="contain"
                />

                    <View style={styles.spotlight}>

                    {/* Header text */}
                    <View style={styles.headerBar}>
                        <Text style={styles.title}>My Groups</Text>
                    </View>

                    {/* Dropdown menu */}
                    {isVisible && (
                        <View style={styles.addButtonMenu}>
                            <TouchableOpacity style={styles.menuButtons}
                            onPress={() => navigation.navigate('CreateGroup')}>
                                <Text style={styles.btnText}>Create Group</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuButtons}
                            onPress={() => navigation.navigate('JoinGroup')}>
                                <Text style={styles.btnText}>Join group via code</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Add button */}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddButtonPress}
                    >
                        <Text style={{ fontSize: 32, color: '#743f43' }}>+</Text>
                    </TouchableOpacity>

                    <FlatList 
                        style={styles.FlatList}
                        data={groups}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.groupListContent}
                        renderItem={({ item }) => (
                            <View style={styles.groupBubble}>
                                <Text style={styles.groupName}>
                                    {item.groupName}
                                </Text>
                            </View>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    {isLoading ? 'Loading groups...' : errorMessage || 'Press the plus button to join a group!'}
                                </Text>
                            }
                    />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
  },
  headerBar: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    zIndex: 100,
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 25,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  logoSection: {
    top: 40,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: -100,
    right: -100,
    top: -50,
    height:900
  },
  spotlight: {
    backgroundColor: '#ffada8',
    top:-70,
    height:600,
    width:350,
    borderRadius: 35
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 35,
    top: 20,
    left: 25,
    color: 'white'
  },
  groupList: {
    flex: 1
  },
  groupListContent: {
    top: 40,
    paddingBottom: 20,
    left:12,
    gap: 12
  },
  groupBubble: {
    backgroundColor: '#f8f3ec',
    height: 80,
    borderRadius: 20,
    paddingLeft: 15,
    paddingVertical: 20,
    minHeight: 60,
    justifyContent: 'center',
    width: 320,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#743f43',
  },
  emptyText: {
    color: '#743f43',
    fontSize: 16,
    marginTop: 10,
},

addButtonMenu: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 300,
    backgroundColor: '#ffd34f',
    borderRadius: 35,
    padding: 30,
    paddingBottom: 65,
    zIndex: 200,
},
menuButtons: {
    borderRadius: 28,
    paddingVertical: 19,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#ec6b6b',
    top: 34,
    marginTop: 10,
},
btnText: {
    color:'white',
    fontWeight:'bold',
    fontSize: 15
}
});