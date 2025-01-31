/**
 * File for screen, which displaying all users
 * Use this screen on profile stack to navigate between other profiles
 *
 * @author Albert Tikaiev
 */

import {ActivityIndicator, FlatList, View, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import {useUser} from "../userstate/UserContext";
import UserItem from "../components/UserItem";
import ErrorMessage from "../components/ErrorMessage";

/**
 * @param navigation Navigation
 * @returns {JSX.Element}
 */
export default function AllUsers({ navigation }) {
    const [users, setUsers] = useState(null);
    const {user} = useUser();

    /**
     * Function to get all users
     */
    async function getAllUsers() {
        try {
            const request = await axios.get(config.api+"/users_all");
            setUsers(request.data);
        }catch (error) {
            ErrorMessage("Failed to get all users");
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return(
        users?
            <View style={styles.container}>
                <FlatList data={users}
                          renderItem={({item}) => item.id !== user.id ?
                              (<UserItem user={item} callback={() => navigation.navigate("ProfileOther", {id: item.id})}/>)
                              :
                              <></>}
                />
            </View>
            :
            <ActivityIndicator size="large"/>
    )
}

const styles = StyleSheet.create({
    container:{
      padding: 10,
    },
})