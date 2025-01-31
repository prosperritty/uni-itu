/**
 * File for user item component that is clickable
 *
 * @author Albert Tikaiev
 */

import config from "../config";
import {Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import getAvatarRequire from "../utils/avatarpaths";

/**
 * @param user User object
 * @param callback Callback
 */
export default function UserItem ({user, callback}){

    return(
        <TouchableOpacity style={styles.user_item} onPress={callback}>
            <Image source={getAvatarRequire(user.avatar_id)} style={styles.avatar}/>
            <Text style={{fontSize: 24, paddingHorizontal: 5}}>{user.name} {user.surname}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    user_item:{
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: config.colors.orange,
        borderRadius: 13,
        height: 50,
        marginTop: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        margin: 10,
        borderRadius: 20
    }
})