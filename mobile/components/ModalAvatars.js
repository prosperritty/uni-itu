/**
 * File for modal window, where use can choose new avatar
 *
 * @author Albert Tikaiev
 */

import {StyleSheet, TouchableOpacity, View, Image} from "react-native";
import config from "../config";
import axios from "axios";
import {useUser} from "../userstate/UserContext";
import ATModal from "./ATModal";
import ErrorMessage from "./ErrorMessage";

/**
 * @param openAvatars Modal open state
 * @param setOpenAvatars Function to change modal open state
 * @param updateUser Callback, updating user information
 * @returns {JSX.Element}
 */
export default function ModalAvatars({openAvatars, setOpenAvatars, updateUser}) {
    //Hook for updating avatar in user state
    const {user, updateUserAvatar} = useUser();

    /**
     * @param value File name of new avatar
     */
    async function updateAvatar(value) {
        try{
            await axios.put(config.api+`/user/${user.id}/avatar/${value}`);
            updateUser();
            updateUserAvatar(value);
            setOpenAvatars(false);
        }catch (error) {
            ErrorMessage("Failed to update profile picture");
        }
    }

    return(
        <ATModal title={"Update avatar"} open={openAvatars} setOpen={setOpenAvatars}>
            <View style={styles.content}>
                <TouchableOpacity onPress={async () => await updateAvatar('1.png')}>
                    <Image source={require('../assets/1.png')} style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => await updateAvatar('2.png')}>
                    <Image source={require('../assets/2.png')} style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => await updateAvatar('3.png')}>
                    <Image source={require('../assets/3.png')} style={styles.image}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => await updateAvatar('4.png')}>
                    <Image source={require('../assets/4.png')} style={styles.image}/>
                </TouchableOpacity>
            </View>
        </ATModal>
    )
}

const styles= StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content:{
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius:13,
        borderBottomLeftRadius:13,
    },
    image:{
        width: 140,
        height: 140,
        borderRadius:70,
    }
})