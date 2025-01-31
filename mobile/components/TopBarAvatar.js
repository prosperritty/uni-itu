/**
 * File for clickable avatar component
 *
 * @author Albert Tikaiev
 */

import {Image, TouchableOpacity, StyleSheet} from "react-native";
import {useUser} from "../userstate/UserContext";
import {useEffect} from "react";
import getAvatarRequire from "../utils/avatarpaths";

/**
 * @param callback Navigation callback
 * @returns {JSX.Element}
 */
export default function TopBarAvatar({callback}){
    const {user} = useUser();

    let avatarpath = getAvatarRequire(user.avatar);

    /**
     * Updates profile picture, when updated
     */
    function updateUserAvatar(){
        avatarpath = getAvatarRequire(user.avatar);
    }

    useEffect(() => {updateUserAvatar()}, [user] );

    return (
        <TouchableOpacity onPress={callback}>
            <Image source={avatarpath} style={styles.avatar}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    }
})