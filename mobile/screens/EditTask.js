//@author Olha Tomylko

import {View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator} from "react-native";
import {useState} from "react";
import axios from "axios";
import config from "../config";
import { useRoute } from '@react-navigation/native';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ErrorMessage from "../components/ErrorMessage";

export default function EditTask({ navigation }) {
    const route = useRoute();
    const { task, userInfo, userlist } = route.params;

    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [date, setDate] = useState(task.deadline ? task.deadline.split(' ')[0] : "time");
    const [time, setTime] = useState(task.deadline ? task.deadline.split(' ')[1] : "time");
    const [priority, setPriority] = useState(task.priority);
    const [repeatable, setRepeatable] = useState(task.repeatable);
    const [repeatabletype, setRepeatableType] = useState(task.repeatabletype);
    const [participating, setSelectedUsers] = useState(task.participating);
    const [from, setFrom] = useState(task.from);

    // State for showing date and time pickers
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

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
        }
    };

    /**
     * Toggles the selection of a user for participating in the task.
     *
     * @param {number} userId - The ID of the user to be toggled.
     */
    const toggleUserSelection = (userId) => {
        if (participating.includes(userId)) {
            setSelectedUsers(participating.filter(id => id !== userId));
        } else {
            setSelectedUsers([...participating, userId]);
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
     * Sends the updated task data to the server to save the changes.
     *
     * @async
     * @function updateTask
     */
    async function updateTask() {
        const formattedDeadline = `${formatDate(date)}T${time || "23:59"}`;

        try {
            const response = await axios.put(`${config.api}/tasks/update/${task.id}`, {
                name,
                description,
                deadline: formattedDeadline,
                priority: parseInt(priority, 10),
                repeatable,
                repeatabletype: parseInt(repeatabletype, 10),
                participating,
            });

            if (response.status === 200 || response.status === 201) {
                        setName("");
                        setDescription("");
                        setDate("");
                        setTime("");
                        setPriority("1");
                        setRepeatable(false); // Reset to boolean false
                        setRepeatableType("0"); // Reset to default string
                        setSelectedUsers("");

                        navigation.goBack();
            } else {
                console.error("Error creating task:", response.data);
            }
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

// JSX rendering the component with input fields and pickers
return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.containerText}>
                    <Text style={styles.enterF}>{"Edit your task"}</Text>
                </View>

                <View style={styles.containerText}>
                <Text style={styles.textName}>{"Name of the event"}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Exp. Do homework"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.containerText}>
                    <Text style={styles.textName}>{"Description"}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Exp. lalala"
                        placeholderTextColor="#888"
                        value={description}
                        onChangeText={setDescription}
                        multiline={true} // Allows multiple lines
                        numberOfLines={1}
                        textAlignVertical="center"
                    />
                </View>

                <View style={styles.Options}>
                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Deadline date"}</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.Button}>
                            <Text>{date ? `${formatDate(date)}` : "Select Date"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Deadline time"}</Text>
                        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.Button}>
                            <Text>{time ? `${time}` : "Select Time"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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


                <View style={styles.containerText}>
                    <Text style={styles.textName}>{"Priority"}</Text>

                    {/* Priority Buttons */}
                    <View style={styles.Options}>
                        <TouchableOpacity
                            style={[styles.Button, priority === 1 ? {backgroundColor: config.colors.light_green} : null]}
                            onPress={() => setPriority(1)}
                        >
                            <Text style={styles.buttonText}>Low</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.Button, priority === 2 ? {backgroundColor: config.colors.orange} : null]}
                            onPress={() => setPriority(2)}
                        >
                            <Text style={styles.buttonText}>Middle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.Button, priority === 3 ? {backgroundColor: config.colors.error} : null]}
                            onPress={() => setPriority(3)}
                        >
                            <Text style={styles.buttonText}>High</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.containerText}>
                    <Text style={styles.textName}>Task is for:</Text>
                           <View style={styles.userListContainer}>
                               <ScrollView style={styles.userList}>
                                   {!userlist ? (
                                       <ActivityIndicator size="large"/>
                                   ) : (
                                       userlist.map(user => (
                                           <TouchableOpacity key={user.id} onPress={() => toggleUserSelection(user.id)}>
                                               <Text style={participating.includes(user.id) ? styles.selectedUser : styles.user}>{user.name}</Text>
                                           </TouchableOpacity>
                                       ))
                                   )}
                               </ScrollView>
                           </View>
                </View>

                <View style={styles.containerText}>
                    <Text style={styles.textName}>{"Repeatable"}</Text>

                    {/* Yes/No Buttons for Repeatable */}
                    <View style={styles.Options}>
                        <TouchableOpacity
                            style={[styles.Button, repeatable ? styles.selectedButton : null]}
                            onPress={() => setRepeatable(true)}
                        >
                            <Text style={styles.buttonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.Button, !repeatable ? styles.selectedButton : null]}
                            onPress={() => {
                                setRepeatable(false);
                                setRepeatableType("0"); // Reset repeatable type if "No" is selected
                            }}
                        >
                            <Text style={styles.buttonText}>No</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Dropdown for Repeat Type if Repeatable is Yes */}
                    {repeatable && (
                        <View style={styles.options}>
                            <TouchableOpacity
                                style={[styles.Button, repeatabletype === 1 ? styles.selectedButtonRep : null]}
                                onPress={() => setRepeatableType(1)}
                            >
                                <Text style={styles.buttonText}>Daily</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.Button, repeatabletype === 2 ? styles.selectedButtonRep : null]}
                                onPress={() => setRepeatableType(2)}
                            >
                                <Text style={styles.buttonText}>Weekly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.Button, repeatabletype === 3 ? styles.selectedButtonRep : null]}
                                onPress={() => setRepeatableType(3)}
                            >
                                <Text style={styles.buttonText}>Monthly</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={updateTask} style={styles.createButton}>
                        <Text style={styles.ButtonText}>Edit task</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={() => {navigation.navigate("Tasks"); }} style={styles.deleteButton}>
                        <Text style={styles.ButtonText}>Delete changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 30,
            right: 30,
        },
        enterF: {
                color: '#000000',
                fontWeight: 'bold',
                paddingBottom: 10,
                fontSize: 20,
        },
        textName: {
                color: '#000000',
                //fontWeight: 'bold',
                paddingBottom: 10,
                fontSize: 15,
        },
        containerText: {
            flex: 1,
            padding: 10,
        },

        containerEnter: {
            flexDirection: 'row',
            width: '100%',
            height: 50,
            backgroundColor: '#FEFAE0',
            borderRadius: 29,
            overflow: 'hidden',
            justifyContent: 'right',
            alignItems: 'center',
        },
        containerButton: {
                justifyContent: 'center',
                alignItems: 'center',
            },
        createButton: {
            width: 250,
            height: 50,
            margin: 8,
            backgroundColor: '#606C38',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',

        },

        deleteButton: {
            width: 250,
            height: 50,
            margin: 8,
            backgroundColor: '#BA1A1A',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',

        },
        ButtonText: {
            color: '#fff',
            fontSize: 22,
        },

        input: {
            backgroundColor: '#FEFAE0',
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
            color: '#000',  // Text color for user input
            lineHeight: 20,
            minHeight: 50
        },
        Options: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        Button: {
            flex: 1,
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#FEFAE0',
            borderRadius: 8,
            marginHorizontal: 5,
        },
        selectedButton: {
            backgroundColor: '#A5B66F',
        },
        selectedButtonRep: {
            backgroundColor: '#DDA15E',
        },
        buttonText: {
            color: '#000',
        },
        userListContainer: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 16,
        },
        userList: {
            flexGrow: 0, // Prevent the ScrollView from growing too tall
        },
        user: {
            padding: 10,
        },
        selectedUser: {
            padding: 10,
            backgroundColor: '#DDA15E',
        },
    }
);