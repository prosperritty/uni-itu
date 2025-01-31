//@author Olha Tomylko

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import config from "../config";
import {useState, useEffect} from "react";
import React from 'react';
import {useUser} from "../userstate/UserContext";
import ModalEventDetails from './ModalEventDetails';

/**
 * Event component displays a single event with details like name, start time, and end time.
 * It provides the ability to delete the event and shows a modal with event details on press.
 */
export default function Event({event, userInfo, refreshEvents}) {

    // State for managing event deletion
    const [deleting, setDelEvent] = useState([]);

    // State for controlling the visibility of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const[userlist, setUserlist] = useState(null);

    async function getAllUsers() {
     const request = await axios.get(config.api+"/users_all");
     setUserlist(request.data);
    }

    /**
     * Deletes the current event by sending a DELETE request to the server.
     * After deletion, it calls the `refreshEvents` function to refresh the event list.
     */
    async function getDelete() {
        const request = await axios.delete(`${config.api}/delevent/${event.id}`);
        setDelEvent(request.data);
        refreshEvents();
    }

    useEffect(() => {
        getAllUsers();
    }, []);


   if (!event){
        return (
            <ActivityIndicator size="large"/>
        )
    }

    return (
        userInfo ? (
            <>
                <TouchableOpacity
                    style={styles.event}
                    onPress={() => setModalVisible(true)} // Open modal on press
                >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{event.name || "event Title"}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.deadlineText}>
                            Start time: {event.starttime ? event.starttime.split(' ')[1] : "time"}
                        </Text>
                        <Text style={styles.deadlineText}>
                            End time: {event.endtime ? event.endtime.split(' ')[1] : "timeend"}
                        </Text>
                    </View>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.confirmButton} onPress={getDelete}>
                            <Text style={styles.buttonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>

                {/* Modal for Task Details */}
                <ModalEventDetails
                    modalVisible={modalVisible}
                    onClose={() => {
                      setModalVisible(false);
                      refreshEvents(); // Refresh tasks after closing the modal
                    }}
                    event={event} // Pass task data to modal
                    userInfo={userInfo}
                    userlist={userlist}
                    refreshEvents={refreshEvents}
                />
            </>
        ) : (
            <ActivityIndicator size='large' />
        )
    );
}

const styles = StyleSheet.create({
    event: {
    marginBottom: 10,
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 100,
        backgroundColor: '#FEFAE0',
        borderRadius: 29,
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 30,
        backgroundColor: '#283618',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 29,
        borderTopRightRadius: 29,
    },
    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingTop: 15,
        paddingLeft: 10,
        justifyContent: 'center',
    },
    deadlineText: {
        color: '#606C38',
        fontSize: 14,
    },
    fromText: {
        color: '#A4A4A4',
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 19,
        marginRight: 19,
    },
    cancelButton: {
        backgroundColor: '#dcdcdc',
        width: 35,
        height: 35,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    confirmButton: {
        backgroundColor: '#DDA15E',
        width: 35,
        height: 35,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#283618',
    },
});
