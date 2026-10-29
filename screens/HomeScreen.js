import { useEffect, useState } from 'react';
import { View,Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getUserGroups } from '../services/groupService';


export default function HomeScreen({ navigation }) {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

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
                    <Text style={styles.title}>My Groups</Text>
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
});