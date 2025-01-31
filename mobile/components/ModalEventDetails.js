//@author Olha Tomylko

import React from 'react';
import {useState, useEffect} from "react";
import { Modal, View, Text, TouchableOpacity, TextInput,  KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";
import config from "../config";

/**
 * A modal component that displays detailed information about an event.
 *
 * @param {boolean} modalVisible - A boolean that determines if the modal is visible.
 * @param {Object} event - The event object containing event details such as name, description, starttime, and endtime.
 * @param {function} onClose - A callback function to close the modal.
 * @param {Object} userInfo - The current user’s information, including user ID and role.
 * @param {Array} userlist - A list of users that includes their IDs and names.
 */
export default function ModalEventDetails({ modalVisible, event, onClose , userInfo, userlist, refreshEvents}) {
    const navigation = useNavigation();
    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);

    useEffect(() => {
        if (event) {
            setName(event.name);
            setDescription(event.description);
        }
    },[event]);

    /**
     * Formats a date string from "DD.MM.YYYY" to "YYYY-MM-DD".
     * @param {string} dateString - The date string in "DD.MM.YYYY" format.
     * @returns {string} The formatted date string in "YYYY-MM-DD" format.
     */
    const formatDate = (dateString) => {
        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (dateRegex.test(dateString)) {
            const [day, month, year] = dateString.split('.');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        }
        return dateString;
    };

    /**
     * Helper function to retrieve and format user names based on the given user IDs.
     *
     * @param {Array} userIds - An array of user IDs to look up in the userlist.
     *
     * @returns {string} A string of user names, joined by commas, or "Loading..." if the userlist is not available.
     */
    const getUserNames = (userIds) => {
        if (!userlist) {
            return "Loading...";
        }
        return userIds.map(userId => {
            const user = userlist.find(user => user.id === userId);
            return user ? user.name : 'Unknown';
        }).join(', '); // Join names with a comma
    };

    /**
     * Handles the "blur" event for the input fields.
     * This function checks whether the values of the event name, description, and times
     * have changed compared to the current event data. If any changes are detected,
     * it triggers the `updateEvent` function to send the updated event details to the server.
     */
    const handleBlur = () => {
        if (name !== event.name || description !== event.description) {
            updateEvent();
        }
    };

    /**
     * Asynchronously sends a PUT request to update the event details on the server.
     * The function formats the start and end times, then sends the updated event data,
     * including name, description, and participating users, to the server.
     *
     * @async
     * @function updateEvent
     * @throws {Error} If the PUT request fails, an error message is shown.
     */
    async function updateEvent() {
       const formattedStartTime = `${formatDate(event.starttime.split(' ')[0])}T${event.starttime.split(' ')[1]}:00`;
       const formattedEndTime = `${formatDate(event.endtime.split(' ')[0])}T${event.endtime.split(' ')[1]}:00`;

        try {

            const response = await axios.put(`${config.api}/events/update/${event.id}`, {
                name,
                starttime: formattedStartTime,
                endtime: formattedEndTime,
                description,
                participating: event.participating,
            });

        } catch (error) {
              if(error.response && error.response.data){
                  const serverError = error.response.data;
                  if(serverError.detail) ErrorMessage(serverError.detail.message);
                  else ErrorMessage("Failed to create new task");
              }
              else{
                ErrorMessage("Failed to create new task");
              }
            }
    }

    /**
     * Renders a modal with event details. The modal allows the user to view and edit
     * details of an event if they are the creator.
     * If the user is the event creator, they can also navigate to the "EditEvent" screen
     * to further edit the event.
     */
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose} // Closes the modal when the request close action occurs
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={'padding'}
            >
                <ScrollView
                  style={[styles.modalContainer, { flexGrow: 0 }]}
                  keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.title}>Details of the event</Text>
                    <View style={{ minHeight: '80%', maxHeight: '95%' }}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name of the event</Text>
                            {event.created_by === userInfo.id && (
                            <Ionicons name="create" size={14} color="#000" style={styles.icon} />
                            )}
                    </View>
                    <TextInput
                    style={styles.taskText}
                    placeholder="Exp. New Year"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    onBlur={handleBlur}
                    editable={event.created_by === userInfo.id}
                    />

                    <View style={styles.row}>
                        <Text style={styles.label}>Description</Text>
                            {event.created_by === userInfo.id && (
                            <Ionicons name="create" size={14} color="#000" style={styles.icon} />
                            )}
                    </View>
                    <TextInput
                    style={styles.taskText}
                    placeholder="No description"
                    value={description}
                    onChangeText={setDescription}
                    onBlur={handleBlur}
                    editable={event.created_by === userInfo.id}
                      multiline={true}
                      textAlignVertical="top"
                    />

                    <Text style={styles.label}>Start time</Text>
                    <Text style={styles.taskText}>{event.starttime}</Text>

                    <Text style={styles.label}>End time</Text>
                    <Text style={styles.taskText}>{event.endtime}</Text>

                    <Text style={styles.label}>Invited</Text>
                    <Text style={styles.taskText}>{getUserNames(event.participating)}</Text>

                    <View style={styles.buttonContainer}>
                    {/* Conditionally render the "Edit" button only if the current user is the creator of the event */}
                    {event.created_by === userInfo.id && (
                          <TouchableOpacity style={styles.editButton} onPress={() => {
                              // Update event data here before navigation
                              onClose();
                              navigation.navigate("EditEvent", {
                                event: { ...event, name, description},
                                userInfo,
                                userlist,
                              }); }}
                          >
                            <Text style={styles.buttonText}>Edit more</Text>
                        </TouchableOpacity>
                    )}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </Modal>
    );
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 10,
    },
    taskText: {
        fontSize: 16,
        marginBottom: 10,
        flexWrap: 'wrap',
        color: '#606C38',
        minHeight: 20,
        maxHeight: 150,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#DDA15E',
        paddingVertical: 7,
        borderRadius: 5,
        marginBottom: 5,
        alignItems: 'center',
        width: '100%',
    },
    closeButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 7,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        paddingTop: 11,
        paddingLeft: 6,
    },
});