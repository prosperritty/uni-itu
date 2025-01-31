//@author Olha Tomylko

import {View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator} from "react-native";
import {useState, useEffect} from "react";
import axios from "axios";
import config from "../config";
import DropDownPicker from "react-native-dropdown-picker";
import {useUser} from "../userstate/UserContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ErrorMessage from "../components/ErrorMessage";
import { Ionicons } from '@expo/vector-icons';

/**
 * TaskCreation component for creating and managing tasks.
 */
export default function TaskCreation({navigation, route}) {

    const { userInfo } = route.params;
    // State hooks for managing task details
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [priority, setPriority] = useState("1");
    const [repeatable, setRepeatable] = useState(false);
    const [repeatabletype, setRepeatableType] = useState("0");

    const[userlist, setUserlist] = useState(null);
    const [participating, setSelectedUsers] = useState([]);

    // State hook for showing/hiding additional settings
    const [moreSettings, setMoreSettings] = useState(false);
    const toggleMoreSettings = () => setMoreSettings(!moreSettings);

    // State hooks for date and time picker visibility
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    /**
     * Handles the date change event.
     * @param {Event} event - The event triggered by date selection.
     * @param {Date} selectedDate - The selected date object.
     */
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            setDate(formattedDate);
            //setShowTimePicker(true); // Open time picker after date is selected
        }
    };

    /**
     * Handles the time change event.
     * @param {Event} event - The event triggered by time selection.
     * @param {Date} selectedTime - The selected time object.
     */
    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const formattedTime = selectedTime.toISOString().split("T")[1].slice(0, 5);
            setTime(formattedTime);
        }
    };

    /**
     * Toggles the user selection for participants in the task.
     * @param {string} userId - The user ID to toggle.
     */
    const toggleUserSelection = (userId) => {
        if (participating.includes(userId)) {
            setSelectedUsers(participating.filter(id => id !== userId));
        } else {
            setSelectedUsers([...participating, userId]);
        }
    };

    async function getAllUsers() {
        const request = await axios.get(config.api+"/users_all");
        setUserlist(request.data);
    }

    useEffect(() => {
        getAllUsers();
    }, []);


    /**
     * Creates a new task by sending a POST request to the server.
     */
    async function createTask() {
        if (participating.length === 0) {
            participating.push(userInfo.id); // Add the default user
        }
        const formattedDeadline = `${date}T${time || "23:59"}`;
        try {
            const response = await axios.post(`${config.api}/tasks/${userInfo.id}/add`, {
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


return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.containerText}>
                    <Text style={styles.enterF}>{"Create your new task"}</Text>
                </View>

                <View style={styles.containerText}>
                <Text style={styles.textName}>{"Name of the event"}<Text style={{ color: 'red' , fontSize: 20}}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Exp. Do homework"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.Options}>
                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Deadline date"}<Text style={{ color: 'red' , fontSize: 20}}>*</Text></Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.Button}>
                            <Text>{date ? `${date}` : "Select Date"}</Text>
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
                        value={new Date()}
                        onChange={onDateChange}
                    />
                )}

                {showTimePicker && (
                    <RNDateTimePicker
                        mode="time"
                        display="default"
                        value={new Date()}
                        onChange={onTimeChange}
                    />
                )}


                <View style={styles.containerText}>
                    <Text style={styles.textName}>{"Priority"}</Text>

                    {/* Priority Buttons */}
                    <View style={styles.Options}>
                        <TouchableOpacity
                            style={[styles.Button, priority === "1" ? {backgroundColor: config.colors.light_green} : null]}
                            onPress={() => setPriority("1")}
                        >
                            <Text style={styles.buttonText}>Low</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.Button, priority === "2" ? {backgroundColor: config.colors.orange} : null]}
                            onPress={() => setPriority("2")}
                        >
                            <Text style={styles.buttonText}>Middle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.Button, priority === "3" ? {backgroundColor: config.colors.error} : null]}
                            onPress={() => setPriority("3")}
                        >
                            <Text style={styles.buttonText}>High</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.containerSet}>
                    <View style={styles.line} />
                    <TouchableOpacity onPress={toggleMoreSettings} style={styles.buttonContainer}>
                        <View style={styles.textContainer}>

                            <Ionicons
                                name={moreSettings ? "chevron-up" : "chevron-down"}
                                size={24}
                                color="black"
                                style={styles.icon}
                            />
                        </View>
                    </TouchableOpacity>
                    {moreSettings === false && <View style={styles.line} />}
                </View>
                {moreSettings && (

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

                )}

                {moreSettings && (
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
                )}

                {moreSettings && (
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
                                style={[styles.Button, repeatabletype === "1" ? styles.selectedButtonRep : null]}
                                onPress={() => setRepeatableType("1")}
                            >
                                <Text style={styles.buttonText}>Daily</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.Button, repeatabletype === "2" ? styles.selectedButtonRep : null]}
                                onPress={() => setRepeatableType("2")}
                            >
                                <Text style={styles.buttonText}>Weekly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.Button, repeatabletype === "3" ? styles.selectedButtonRep : null]}
                                onPress={() => setRepeatableType("3")}
                            >
                                <Text style={styles.buttonText}>Monthly</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                )}

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={createTask} style={styles.createButton}>
                        <Text style={styles.ButtonText}>Create new task</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={() => {navigation.goBack();}} style={styles.deleteButton}>
                        <Text style={styles.ButtonText}>Delete</Text>
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
        containerSet: {
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        line: {
            height: 1,
            backgroundColor: '#ccc',
        },
        buttonContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
        },
        textContainer: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },

        icon: {
            marginTop: 5,
        },
    }
);