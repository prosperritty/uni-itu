/**
 * File for login screen
 *
 * @author Albert Tikaiev
 */

import axios from 'axios';
import config from "../config";
import {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {useUser} from "../userstate/UserContext";
import UserItem from "../components/UserItem";
import ErrorMessage from "../components/ErrorMessage";

/**
 * This screen have to display list of all Users can be logged in with
 *
 * This screen is always displayed on start application
 */
export default function Login (){
    const[userlist, setUserlist] = useState(null)
    //Function from user context
    const {loginUser} = useUser();

    /**
     * Function to get all users
     */
    async function getAllUsers() {
        try{
            const request = await axios.get(config.api+"/users_all");
            setUserlist(request.data);
        } catch (error) {
            ErrorMessage("Failed to get all users");
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [])

    return(
        <View style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.large_text}>DoFam</Text>
            </View>

            <View style={styles.content}>

                {/*Text content*/}
                <View style={styles.welcomebar}>
                    <Text style={[styles.large_text,  { color: 'white' }]}>Welcome to DoFam!</Text>
                </View>
                <View style={styles.loginbar}>
                    <Text style={[styles.large_text,  { color: 'white' }]}>Login as user</Text>
                </View>

                {/*User lists*/}
                <View style={{width:'100%'}}>
                    <FlatList data={userlist}
                              renderItem={({item}) => <UserItem user={item} callback={() => loginUser({id: item.id, avatar: item.avatar_id})}/>}
                    />
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    content:{
        flex: 1,
        alignItems: 'center',
        padding:10,
    },
    topbar: {
        minHeight: 65,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.colors.main,
    },
    welcomebar:{
        minHeight: 70,
        marginBottom: 10,
        width: '100%',
        backgroundColor: config.colors.light_green,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginbar: {
        minHeight: 65,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.colors.lighter_green,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,

    },
    large_text:{
        fontSize: 24,
    }
})