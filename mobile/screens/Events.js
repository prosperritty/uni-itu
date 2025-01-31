//@author Olha Tomylko

import {View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native";
import {useState, useEffect} from "react";
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import config from "../config";
import Event from "../components/Event";
import {useUser} from "../userstate/UserContext";


/**
 * Main component for displaying a list of events.
 * Fetches user data and events, and renders them.
 * Allows navigating to the EventCreation screen to add new events.
 */
export default function Events({navigation, route}) {
    const [events, setEvents] = useState([]);

    const [userInfo, setUserInfo] = useState(null);
        const {user} = useUser();

    /**
     * Function to fetch the user data from the server based on user ID.
     * @returns {void}
     */
    async function getUser() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(config.api+`/user/${userId}`);
        setUserInfo(request.data);
    }

    /**
     * Function to fetch the events for the user.
     * @returns {void}
     */
    async function getEvent() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(`${config.api}/events/${userId}`);
        setEvents(request.data);
    }

    function refreshEvents() {
        getEvent();
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getEvent();
        });
        return unsubscribe;
    }, [navigation]);

    return (
    // Conditional rendering to show either the events or loading indicator
      userInfo ?
        <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.containerEvent}>
                        <Text style={styles.enter}>{"Your future events:"}</Text>
                    </View>
                    <View style={styles.containerEvent}>
                        <View style={{ width: '100%' }} >
                            {events.map((dateItem, dateIndex) => (
                                <View key={dateIndex}>
                                    <Text style={styles.enterF}>{dateItem.date}</Text>
                                    {dateItem.events.map((event, eventIndex) => (
                                        <Event key={eventIndex} event={event} userInfo={userInfo} refreshEvents={refreshEvents}/>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.containerScroll}>
                    </View>
                </ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("EventCreation", { userInfo })}>
                        <Text style={styles.plus}>+</Text>
                    </TouchableOpacity>
                </View>

        </View>
        // Loading spinner while user info is being fetched
    :
    <ActivityIndicator size='large'/>
    );
}


const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 30,
            right: 30,
        },
        button: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#283618',
            justifyContent: 'center',
            alignItems: 'center',
        },
        plus: {
            fontSize: 45,
            color: '#fff',
        },
        enter: {
                color: '#000000',
                fontWeight: 'bold',
                fontSize: 17,
        },
        enterF: {
                color: '#000000',
                //fontWeight: 'bold',
                paddingBottom: 5,
                fontSize: 17,
        },

        containerEvent: {
            flex: 1,
            margin: 11,
            justifyContent: 'center',
            alignItems: 'center',
        },
        containerScroll: {
            height:60,
            flex: 1,
            margin: 11,
            justifyContent: 'center',
            alignItems: 'center',
        }
    }
);