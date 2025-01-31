/**
 * File for profile screen, which displaying all information about user
 * Can be entered by clicking top left button from anywhere
 *
 * @author Albert Tikaiev
 */

import {ActivityIndicator, Text, View, StyleSheet, Image, TouchableOpacity, FlatList} from "react-native";
import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";
import {useUser} from "../userstate/UserContext";
import ATButton from "../components/ATButton";
import ModalAvatars from "../components/ModalAvatars";
import getAvatarRequire from "../utils/avatarpaths";
import Achievement from "../components/Achievement";
import ErrorMessage from "../components/ErrorMessage";
import HorizontalBreak from "../components/HorizontalBreak";

/**
 * @param navigation Navigation
 * @param route Route, for extracting user information
 * @returns {JSX.Element}
 */
export default function Profile({ navigation , route}) {
    //User states
    const [userInfo, setUserInfo] = useState(null);
    const [achievements, setAchievements] = useState(null);
    const {user, logoutUser} = useUser();

    //Profile picture states
    const [avatarPath, setavatarPath ]= useState();
    const [openAvatars, setOpenAvatars] = useState(false);

    //Bottom information switch
    const [seeStats, setSeeStats] = useState(true);

    /**
     * Function to get all user information
     */
    async function getUser() {
        try{
            const userId = route.params?.id ? route.params.id : user.id;
            const requestuser = await axios.get(config.api+`/user/${userId}`);
            setUserInfo(requestuser.data);
            setavatarPath(getAvatarRequire(requestuser.data.avatar_id));
            const requestachievements = await axios.get(config.api+`/user/achievements/${userId}`);
            setAchievements(requestachievements.data);
        }catch (error) {
            ErrorMessage("Failed to get user information");
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUser();
        });
        return unsubscribe;
    }, []);


    return (
        userInfo ?
                <View style={styles.container}>

                    {/*User information block*/}
                    <View style={styles.profile_container}>
                        <Text style={styles.large_text}>{userInfo.name} {userInfo.surname}</Text>
                        {user.id === userInfo.id ?
                            <TouchableOpacity onPress={() => setOpenAvatars(true)}>
                                <Image source={avatarPath} style={styles.avatar}/>
                            </TouchableOpacity>
                            :
                            <Image source={avatarPath} style={styles.avatar}/>
                        }
                        <Text style={styles.large_text}>{userInfo.role}</Text>
                        <Text style={styles.large_text}>Birthday : {userInfo.dob}</Text>
                    </View>

                    {/*Navigation to all users list*/}
                    {user.id === userInfo.id ?
                        <View style={styles.button}>
                            <ATButton title={"See all members"} callback={() => navigation.navigate("AllUsers")}/>
                        </View>
                        :
                        <></>
                    }

                    {/*Switch between displaying statistics or achievements*/}
                    <View style={styles.switches_button}>
                        <ATButton title={"Statistics"} callback={() => setSeeStats(true)} isActive={seeStats}/>
                        <ATButton title={"Achievements"} callback={() => setSeeStats(false)} isActive={!seeStats}/>
                    </View>

                    <ModalAvatars openAvatars={openAvatars} setOpenAvatars={setOpenAvatars} updateUser={getUser}/>

                    {/*Statistics/Achievements*/}
                    <HorizontalBreak/>
                    {seeStats ?
                    <View>
                        <View style={styles.stats_container}>
                            <Text style={styles.large_text}>Created tasks</Text>
                            <Text style={styles.large_text}>{userInfo.created_tasks}</Text>
                        </View>
                        <View style={styles.stats_container}>
                            <Text style={styles.large_text}>Done tasks</Text>
                            <Text style={styles.large_text}>{userInfo.done_tasks}</Text>
                        </View>
                        <View style={styles.stats_container}>
                            <Text style={styles.large_text}>Created events</Text>
                            <Text style={styles.large_text}>{userInfo.created_events}</Text>
                        </View>
                    </View>
                    :
                    <View style={{flex:1}}>
                        {achievements && achievements.length !== 0 ?
                            <FlatList data={achievements} renderItem={({item}) => <Achievement achievement={item}/>}/>
                            :
                            <Text style={styles.large_text}>No achievements</Text>
                        }
                    </View>
                    }

                    {/*Logout button*/}
                    {user.id === userInfo.id ?
                        <TouchableOpacity style={styles.logout_button} onPress={() => {logoutUser()}}>
                            <Text style={styles.large_text}>Logout</Text>
                        </TouchableOpacity>
                        :
                        <></>
                    }

                </View>
                :
                <ActivityIndicator size='large'/>

    );
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        padding: 5,
    },
    profile_container: {
        backgroundColor: config.colors.main,
        height: 300,
        borderRadius: 13,
        justifyContent : 'space-evenly',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    button: {
        height:60,
        width: '100%'
    },
    large_text : {
        fontSize: 24
    },
    switches_button :{
        height:60,
        width: '100%',
        flexDirection: 'row',
    },
    stats_container: {
        flexDirection: 'row',
        alignContent: 'center',
        padding: 20,
        justifyContent: 'space-between',
        backgroundColor : config.colors.main,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logout_button:{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 1,
        marginVertical: 5,
        padding:5,
        borderRadius:13,
        backgroundColor: config.colors.error
    }
})