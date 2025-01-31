//@author Olha Tomylko

import React from 'react';
import {useState, useEffect} from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";
import config from "../config";
import RNDateTimePicker from "@react-native-community/datetimepicker";

/**
 * ModalTaskDetails component to display detailed information about a task in a modal.
 * Allows the user to view the task details and optionally edit the task if the user is the creator.
 *
 * @param {boolean} modalVisible - Boolean to control the visibility of the modal.
 * @param {object} task - The task object containing task details like name, description, deadline, etc.
 * @param {function} onClose - Function to handle closing the modal.
 * @param {object} userInfo - The current user's information (e.g., id, name, etc.).
 * @param {array} userlist - List of all users, used to resolve user names from IDs.
 */
export default function ModalTaskDetails({ modalVisible, task, onClose , userInfo, userlist, refreshTasks}) {
    const navigation = useNavigation();

    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [date, setDate] = useState(task.deadline ? task.deadline.split(' ')[0] : "time");
    const [time, setTime] = useState(task.deadline ? task.deadline.split(' ')[1] : "time");

    // State for showing date and time pickers
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (date && time) {
            handleBlur();
        }
    }, [date, time]);

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description);
        }
    },[task]);

    /**
     * Handles the change in date picker selection.
     *
     * @param {Object} event - The event object.
     * @param {Date} selectedDate - The selected date.
     */
    const onDateChange = (event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
                const formattedDate = selectedDate.toISOString().split("T")[0];
                setDate(formattedDate);
                handleBlur();
            }
        };

    /**
     * Handles the change in time picker selection.
     *
     * @param {Object} event - The event object.
     * @param {Date} selectedTime - The selected time.
     */
    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const formattedTime = selectedTime.toISOString().split("T")[1].slice(0, 5);
            setTime(formattedTime);
            handleBlur();
        }

    };

    /**
     * Formats a date string from 'DD.MM.YYYY' to 'YYYY-MM-DD'.
     *
     * @param {string} dateString - The date string to be formatted.
     * @returns {string} The formatted date string in 'YYYY-MM-DD' format.
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
     * Returns the string representation of the task's priority.
     *
     * @param {number} priority - The priority level (1, 2, or 3).
     * @returns {string} - The string corresponding to the priority (e.g., "Low", "Middle", "High").
     */
    const getPriorityText = (priority) => {
        switch (priority) {
            case 1:
                return 'Low';
            case 2:
                return 'Middle';
            case 3:
                return 'High';
            default:
                return 'Unknown';
        }
    };

    /**
     * Resolves user names from a list of user IDs.
     *
     * @param {array} userIds - List of user IDs.
     * @returns {string} - A comma-separated list of user names, or "Loading..." if the user list is not available.
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
     * Handles the blur event for the input fields (name, description, date, and time).
     * If any of the fields have changed from their initial values, it triggers the updateTask function to update the task.
     */
    const handleBlur = () => {
        if (name !== task.name || description !== task.description || date !== task.deadline.split(' ')[0] || time !== task.deadline.split(' ')[1]) {
            updateTask();
        }
    };

    /**
     * Updates the task with the new values entered by the user.
     * The updated task includes name, description, deadline, priority, repeatability, and participating users.
     * Sends a PUT request to the server to update the task.
     */
    async function updateTask() {
        const formattedDeadline = `${formatDate(date)}T${time || "23:59"}:00`;
        try {
            const response = await axios.put(`${config.api}/tasks/update/${task.id}`, {
                name,
                description,
                deadline: formattedDeadline,
                priority: task.priority,
                repeatable: task.repeatable,
                repeatabletype: task.repeatabletype,
                participating: task.participating,
            });


        } catch (error) {
        console.error("Error updating task:", error);
                ErrorMessage("Failed to update task");
          }
    }

    /**
     * The component renders a modal window for displaying and editing task details.
     * It shows fields for the task's name, description, deadline, and time.
     * If the task is created by the current user, fields are editable.
     */
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={'padding'}
            >
                <ScrollView
                  style={[styles.modalContainer, { flexGrow: 0 }]}
                  keyboardShouldPersistTaps="handled"
                >
                <Text style={styles.title}>Details of the task</Text>

                <View style={{ minHeight: '80%', maxHeight: '95%' }}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name of the task</Text>
                            {task.created_by === userInfo.id && (
                            <Ionicons name="create" size={14} color="#000" style={styles.icon} />
                            )}
                    </View>
                    <TextInput
                    style={styles.taskText}
                    placeholder="Exp. Do homework"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                    onBlur={handleBlur}
                    editable={task.created_by === userInfo.id}
                    />

                    <View style={styles.row}>
                        <Text style={styles.label}>Description</Text>
                            {task.created_by === userInfo.id && (
                            <Ionicons name="create" size={14} color="#000" style={styles.icon} />
                            )}
                    </View>
                    <TextInput
                    style={styles.taskText}
                    placeholder="No description"
                    value={description}
                    onChangeText={setDescription}
                    onBlur={handleBlur}
                    editable={task.created_by === userInfo.id}
                      multiline={true}
                      textAlignVertical="top"
                    />


                    <View style={styles.row}>
                        <Text style={styles.label}>Deadline</Text>
                        {task.created_by === userInfo.id && (
                            <Ionicons name="create" size={14} color="#000" style={styles.icon} />
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => task.created_by === userInfo.id && setShowDatePicker(true)}
                        style={styles.Button}
                        disabled={task.created_by !== userInfo.id}
                    >
                        <Text style={styles.taskText}>{`${formatDate(date)}`}</Text>
                    </TouchableOpacity>


                    <View style={styles.row}>
                        <Text style={styles.label}>Deadline time</Text>
                        {task.created_by === userInfo.id && (
                            <Ionicons name="create" size={14} color="#000" style={styles.icon} />
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={() => task.created_by === userInfo.id && setShowTimePicker(true)}
                        style={styles.Button}
                        disabled={task.created_by !== userInfo.id}
                    >
                        <Text style={styles.taskText}>{`${time}`}</Text>
                    </TouchableOpacity>


                     {showDatePicker && (
                         <RNDateTimePicker
                             mode="date"
                             display="default"
                             value={new Date(`${formatDate(date)}T00:00:00.000Z`)}
                             onChange={onDateChange}
                         />
                     )}

                     {showTimePicker && (
                         <RNDateTimePicker
                             mode="time"
                             display="default"
                             value={new Date(`${formatDate(date)}T${time}:00.000Z`)}
                             onChange={onTimeChange}
                         />
                     )}

                    <Text style={styles.label}>This is the task for</Text>
                    <Text style={styles.taskText}>
                      {task.participating.length > 0 ? getUserNames(task.participating) : 'No users selected'}
                    </Text>

                    <Text style={styles.label}>Task priority</Text>
                    <Text style={styles.taskText}>{getPriorityText(task.priority)}</Text>

                    <Text style={styles.label}>Task repetition</Text>
                    <Text style={styles.taskText}>{task.repeatable ? `Yes${task.repeatabletype ? `: ${getRepeatableTypeText(task.repeatabletype)}` : ""}` : "No"}</Text>

                    <View style={styles.buttonContainer}>
                     {/* Render the "Edit" button only if the current user is the creator of the task */}
                        {task.created_by === userInfo.id && (
                          <TouchableOpacity style={styles.editButton} onPress={() => {
                              // Update task data here before navigation
                              onClose();
                              navigation.navigate("EditTask", {
                                task: { ...task, name, description, deadline: `${date} ${time}` },
                                userInfo,
                                userlist,
                              }); }}
                          >
                             <Text style={styles.buttonText}>Edit More</Text>
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

/**
 * Returns a human-readable string representing the repeatable type of a task.
 * This function is used to convert a repeatable type value (1, 2, or 3) into a corresponding string
 * indicating how often the task repeats (Daily, Weekly, or Monthly).
 *
 * @param {number} type - The repeatable type value (1 for Daily, 2 for Weekly, 3 for Monthly).
 * @returns {string} A string representing the repeatable type:
 *                   - "Daily" if type is 1,
 *                   - "Weekly" if type is 2,
 *                   - "Monthly" if type is 3,
 *                   - An empty string for any other value.
 */
const getRepeatableTypeText = (type) => {
    switch (type) {
        case 1:
            return "Daily";
        case 2:
            return "Weekly";
        case 3:
            return "Monthly";
        default:
            return "";
    }
};


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
        padding: 3,
        fontSize: 15,
        color: '#606C38',
        flexWrap: 'wrap',
        borderRadius: 5,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        textAlignVertical: 'top',
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
        marginBottom: 5, // Space between buttons
        alignItems: 'center',
        width: '100%', // Make the button full width
    },
    closeButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 7,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%', // Make the button full width
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