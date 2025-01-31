//@author Olha Tomylko

import {View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator} from "react-native";
import {useState, useEffect} from "react";
import axios from "axios";
import config from "../config";
import Event from "../components/Event";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ErrorMessage from "../components/ErrorMessage";

/**
 * Screen for creating a new event.
 * Allows users to set event details such as name, description, start and end time,
 * and select users to participate.
 */
export default function EventCreation({navigation, route}) {
    const { userInfo } = route.params;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [starttime, setStarttime] = useState("");
    const [endtime, setEndtime] = useState("");
    const [participating, setSelectedUsers] = useState([]);
    const[userlist, setUserlist] = useState(null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [start, setStart] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [moreSettings, setMoreSettings] = useState(false);

    /**
     * Toggles the visibility of the additional settings (event end time).
     */
    const toggleMoreSettings = () => setMoreSettings(!moreSettings);

    /**
     * Handles date change when the date picker is used.
     * Updates either the start or end date based on the state.
     *
     * @param {Object} event - The event triggered by the date picker.
     * @param {Date} selectedDate - The selected date from the date picker.
     */
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            if (start){
            setDate(formattedDate);
            setStart(false);
            }
            else {
            setDateEnd(formattedDate);}
            //setShowTimePicker(true); // Open time picker after date is selected
        }
    };

    /**
     * Handles time change when the time picker is used.
     * Updates either the start or end time based on the state.
     *
     * @param {Object} event - The event triggered by the time picker.
     * @param {Date} selectedTime - The selected time from the time picker.
     */
    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const formattedTime = selectedTime.toISOString().split("T")[1].slice(0, 5);
            if(start){
            setStarttime(formattedTime);
            setStart(false);
            }
            else {
            setEndtime(formattedTime);}
        }
    };

    /**
     * Toggles the user selection for participation in the event.
     * If the user is already selected, it removes them from the list, otherwise, it adds them.
     *
     * @param {number} userId - The user ID to be added or removed from the participation list.
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
     * Creates a new event by sending event details to the server.
     * On success, it resets the form fields and navigates back.
     */
    async function createEvent() {
        const formattedStartTime = `${date}T${starttime || "00:00:00"}`;
        const formattedEndTime = `${dateEnd || date}T${endtime || "23:59:59"}`;
        if (participating.length === 0) {
            participating.push(userInfo.id); // Add the default user
        }

        try {

            const response = await axios.post(`${config.api}/events/${userInfo.id}/add`, {
                name,
                starttime: formattedStartTime,
                endtime: formattedEndTime,
                description,
                participating,
            });

            if (response.status === 200 || response.status === 201) {
                        setName("");
                        setDescription("");
                        setDate("");
                        setDateEnd("");
                        setStarttime("00:00:00");
                        setEndtime("00:00:00");
                        setSelectedUsers("");
                        navigation.goBack();
            } else {
                console.error("Error creating event:", response.data);
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
                    <Text style={styles.enterF}>{"Create your new event"}</Text>
                </View>

                <View style={styles.containerText}>
                <Text style={styles.textName}>{"Name of the event"}<Text style={{ color: 'red' , fontSize: 20}}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Exp. New Year party"
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

                <View style={styles.containerDateTime}>
                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Date start"} <Text style={{ color: 'red' , fontSize: 20}}>*</Text></Text>
                        <TouchableOpacity onPress={() => {setStart(true); setShowDatePicker(true); }}  style={styles.input}>
                            <Text>{date ? `${date}` : "Select Date"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Start time"}</Text>
                        <TouchableOpacity onPress={() => {setStart(true); setShowTimePicker(true); }} style={styles.input}>
                            <Text>{starttime ? `${starttime}` : "Select Time"}</Text>
                        </TouchableOpacity>
                     </View>
                </View>

                    <View style={styles.containerDateTime}>
                        <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Date end"}</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                            <Text>{dateEnd ? `${dateEnd}` : "Select Date"}</Text>
                        </TouchableOpacity>
                        </View>

                        <View style={styles.containerText}>
                            <Text style={styles.textName}>{"End time"}</Text>
                            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
                                <Text>{endtime ? `${endtime}` : "Select Time"}</Text>
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
                    <Text style={styles.textName}>Invited:</Text>
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

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={createEvent} style={styles.createButton}>
                        <Text style={styles.ButtonText}>Create new event</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={() => {navigation.goBack(); }} style={styles.deleteButton}>
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
                //fontWeight: 'bold',
                paddingBottom: 10,
                fontSize: 15,
        },

        containerText: {
            flex: 1,
            padding: 10,
        },

        containerDateTime: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
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