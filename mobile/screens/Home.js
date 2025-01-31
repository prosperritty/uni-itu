//@author Olha Tomylko and Albert Tikaiev

import {View, Text, Button, ScrollView, StyleSheet, ActivityIndicator} from "react-native";
import {useState, useEffect} from "react";
import axios from "axios";
import config from "../config";
import Task from "../components/Task";
import EventHome from "../components/EventHome";
import PlusButton from "../components/CreateButton";
import {useUser} from "../userstate/UserContext";
import JarHome from "../components/JarHome";

export default function Home({navigation, route}) {
    // State variables to store fetched data
    const [tasks, setTasks] = useState([]);
    const [event, setEventHome] = useState({});
    const [jar, setJar] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const {user} = useUser();

    /**
     * Fetches user information from the server.
     * @returns {void}
     */
    async function getUser() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(config.api+`/user/${userId}`);
        setUserInfo(request.data);
    }

    /**
     * Fetches the next upcoming event for the user.
     * @returns {void}
     */
    async function getEvent() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(`${config.api}/events_last/${userId}`);
        setEventHome(request.data);
    }

    /**
     * Fetches tasks for the user.
     * @returns {void}
     */
    async function getTask() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(`${config.api}/tasks/${userId}`);//user id
        setTasks(request.data.slice(0,3));
    }

    /**
     * Fetches the jar with the highest contribution.
     * @returns {void}
     */
    async function getJar(){
        const request = await axios.get(config.api+"/jars/highest");
        setJar(request.data);
    }

    function refreshTasks() {
        getTask();
    }

    useEffect(() => {
        getUser();
    }, []);

    // Fetch data whenever the screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getTask();
            getEvent();
            getJar();
        });
        return unsubscribe;
    }, [navigation]);


    return (
    userInfo ?
        <View style={{ flex: 1 }}>
        <ScrollView>
            <View style={styles.startContainer}>
            <Text style={styles.enterF}>{"Welcome back"} {userInfo.name}</Text>
            <Text style={styles.enterS}>{"Your schedule for the coming days:"}</Text>
            </View>
            <View style={styles.eventContainer}>
            <View style={{width:'100%', flexDirection : 'row'}}>
            {event ?
                    <EventHome event={event} onLayout={getEvent} />
                :
                <View style={styles.event}>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>{"Future event"}</Text>
                            </View>
                            <View style={styles.content}>
                            <Text style={styles.dataText}>{"No event"}</Text>
                            </View>
                        </View>
                    </View>
            }
                    <JarHome jar={jar}/>
                </View>
            </View>

            {tasks && tasks.length > 0 ?
                <View style={styles.containerTasks}>
                        <View style={{ width: '100%' }}>
                            {tasks.map((task, index) =>
                                <Task key={index} task={task}  userInfo={userInfo} refreshTasks={refreshTasks}/>
                            )}
                        </View>
                </View>
            :

                <View style={styles.containerTasks }>
                        <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.enterS}>{"No event"}</Text>
                        </View>
                </View>

            }
                <View style={styles.containerScroll}>
                </View>
        </ScrollView>
        <PlusButton navigation={navigation} userInfo={userInfo}/>
        </View>
        :
                        <ActivityIndicator size='large'/>
    );
}


/**
 * @const styles
 * @brief Stylesheet for Home component.
 */
const styles = StyleSheet.create({
        enterF: {
                color: '#000000',
                //fontWeight: 'bold',
                marginTop: 11,
                marginLeft: 11,
                paddingBottom: 5,
                fontSize: 17,
        },
        enterS: {
                color: '#000000',
                marginLeft: 11,
                fontWeight: 'bold',
                paddingBottom: 10,
                fontSize: 19,
        },
        containerTasks: {
            flex: 1,
            margin: 11,
            justifyContent: 'center',
            alignItems: 'center',
        },
        startContainer: {
              flex: 1,
              backgroundColor: 'rgba(155, 182, 111, 0.16)',
              justifyContent: 'right',
              alignItems: 'right',
          },

        eventContainer: {
            flex: 1,
            margin: 11,
            justifyContent: 'right',
            alignItems: 'right',
        },
        containerScroll: {
            height:60,
            flex: 1,
            margin: 11,
            justifyContent: 'center',
            alignItems: 'center',
        },
        event: {
                marginBottom: 10,
                marginHorizontal: 5,
            },
        container: {
            flexDirection: 'row',
            width: 200,
            height: 190,
            borderRadius: 29,
            overflow: 'hidden',
            alignItems: 'tight',
        },
        header: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 60,
            backgroundColor: '#283618',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 29,
            borderTopRightRadius: 29,
        },
        headerText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 20,
        },

        content: {
            flex: 1,
            paddingTop: 45,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dataText: {
            color: '#606C38',
            fontSize: 14,
        },

    }
);