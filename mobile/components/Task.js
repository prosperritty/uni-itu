//@author Olha Tomylko

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import config from "../config";
import {useState, useEffect} from "react";
import React from 'react';
import {useUser} from "../userstate/UserContext";
import ModalTaskDetails from './ModalTaskDetails';

/**
 * The Task component displays information about a task and allows it to be deleted or marked as done.
 * It also provides the ability to open a modal with detailed information about the task.
 *
 * @param {Object} task - The task object containing task data.
 * @param {Object} userInfo - The current user information.
 * @param {Function} refreshTasks - A function to refresh the task list after task actions.
 */
export default function Task({ task, userInfo, refreshTasks}) {
    // State for tracking task deletion and completion
    const [deleting, setDelTask] = useState([]);
    const [doneTask, setDoneTask] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const[userlist, setUserlist] = useState(null);

    /**
     * Fetches all users from the API.
     * @async
     */
    async function getAllUsers() {
        const request = await axios.get(config.api+"/users_all");
        setUserlist(request.data);
    }

    /**
     * Deletes the current task.
     * @async
     */
    async function getDelete() {
        const request = await axios.delete(`${config.api}/deltask/${task.id}`);
        setDelTask(request.data);
        refreshTasks(); // Refreshes the task list after deletion
    }

    /**
     * Marks the current task as done.
     * @async
     */
    async function getDone() {
        const request = await axios.put(`${config.api}/tasks/${userInfo.id}/doneupdate/${task.id}`);
        setDoneTask(request.data);
        refreshTasks(); // Refreshes the task list after marking as done
    }

    /**
     * Retrieves the username associated with the provided user ID.
     * @param {number} userId - The user ID to find.
     * @returns {string} The username corresponding to the given user ID or "Unknown" if not found.
     */
    function getUserName(userId) {
        if (!userlist) {
            return "Loading...";
        }

        const user = userlist.find((u) => u.id === userId);
        return user ? user.name : "Unknown";
    }

    useEffect(() => {
        getAllUsers();
    }, []);

   if (!task){
        return (
            <ActivityIndicator size="large"/>
        )
    }

   return (
            userInfo ? (
                <>
                    <TouchableOpacity
                        style={styles.task}
                        onPress={() => setModalVisible(true)} // Open modal on press
                    >
                        <View style={styles.container}>
                            <View
                                style={[
                                    styles.left_bar,
                                    { backgroundColor: getBackgroundColor(task.priority) }
                                ]}
                            />

                            <View
                                style={[
                                    styles.header,
                                    isPastDeadline(task.deadline) && task.done !== true && { backgroundColor: "#960018" },
                                ]}
                            >
                                <Text style={styles.headerText}>{task.name || "Task Title"}</Text>
                            </View>

                            <View style={styles.content}>
                                <Text style={styles.deadlineText}>Until: {task.deadline}</Text>
                                <Text style={styles.fromText}>From: {getUserName(task.created_by)}</Text>
                            </View>

                            <View style={styles.buttonContainer}>
                                {task.created_by === userInfo.id && (
                                    <TouchableOpacity style={styles.cancelButton} onPress={getDelete}>
                                        <Text style={styles.buttonText}>✕</Text>
                                    </TouchableOpacity>
                                )}
                                {!task.done && (
                                    <TouchableOpacity style={styles.confirmButton} onPress={getDone}>
                                        <Text style={styles.buttonText}>✓</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Modal for Task Details */}
                    {modalVisible && (
                          <ModalTaskDetails
                              modalVisible={modalVisible}
                              onClose={() => {
                                  setModalVisible(false);
                                  refreshTasks(); // Refresh tasks after closing the modal
                              }}
                              task={task} // Pass task data to modal
                              userInfo={userInfo}
                              userlist={userlist}
                              refreshTasks={refreshTasks}
                          />
                    )}
                </>
            ) : (
                <ActivityIndicator size='large' />
            )
        );
    }

/**
 * Returns the background color associated with the task's priority level.
 *
 * @param {number} priority - The priority level of the task.
 * @returns {string} The color associated with the priority level.
 */
const getBackgroundColor = (priority) => {
    if (priority === 1) {
        return config.colors.light_green;
    } else if (priority === 2) {
        return config.colors.orange;
    } else if (priority === 3) {
        return config.colors.error;
    } else {
        return '#ccc';
    }
};

/**
 * Checks if the given deadline has passed.
 *
 * @param {string} deadline - The deadline date in the format "DD.MM.YYYY HH:mm".
 * @returns {boolean} Returns `true` if the deadline is earlier than the current date and time, otherwise `false`.
 */
const isPastDeadline = (deadline) => {
    if (!deadline) return false;
    const [day, month, yearAndTime] = deadline.split('.');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes] = time.split(':');

    const deadlineDate = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes
    );

    return deadlineDate < new Date();
};

const styles = StyleSheet.create({
    task: {
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
    left_bar: {
        height: '100%',
        width: 24,
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
        backgroundColor: '#8bc34a',
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
