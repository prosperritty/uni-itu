//@author Olha Tomylko

import {View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator} from "react-native";
import {useState, useEffect} from "react";
import axios from "axios";
import config from "../config";
import { useRoute } from '@react-navigation/native';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ErrorMessage from "../components/ErrorMessage";

export default function EditEvent({navigation}) {
    // Extract route parameters: event details, user info, and list of users
    const route = useRoute();
    const { event, userInfo, userlist } = route.params;

    const [name, setName] = useState(event.name);
    const [description, setDescription] = useState(event.description);
    const [date, setDate] = useState(event.starttime ? event.starttime.split(' ')[0] : "time");
    const [dateEnd, setDateEnd] = useState(event.endtime ? event.endtime.split(' ')[0] : "time");
    const [starttime, setStarttime] = useState(event.starttime ? event.starttime.split(' ')[1] : "time");
    const [endtime, setEndtime] = useState(event.endtime ? event.endtime.split(' ')[1] : "time");
    const [participating, setSelectedUsers] = useState(event.participating);

    // State variables for date and time picker visibility
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [start, setStart] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [notchanged, setNotChanged] = useState(true);

    /**
     * Handles date selection from the date picker.
     * @param {object} event - The event object.
     * @param {Date} selectedDate - The selected date.
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
     * Handles time selection from the time picker.
     * @param {object} event - The event object.
     * @param {Date} selectedTime - The selected time.
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
      * Toggles user selection for the event.
      * Adds or removes a user from the list of selected participants.
      * @param {string} userId - The ID of the user to toggle.
      */
    const toggleUserSelection = (userId) => {
        if (participating.includes(userId)) {
            setSelectedUsers(participating.filter(id => id !== userId));
        } else {
            setSelectedUsers([...participating, userId]);
        }
    };

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
     * Sends an API request to update the event details.
     * On success, clears the form and navigates back to the previous screen.
     */
    async function updateEvent() {
       const formattedStartTime = `${formatDate(date)}T${starttime || "00:00:00"}`;
       const formattedEndTime = `${formatDate(dateEnd) || formatDate(date)}T${endtime || "23:59:59"}`;

        try {

            const response = await axios.put(`${config.api}/events/update/${event.id}`, {
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
                console.error("Error updating event:", response.data);
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
                    <Text style={styles.enterF}>{"Edit your event"}</Text>
                </View>

                <View style={styles.containerText}>
                <Text style={styles.textName}>{"Name of the event"}</Text>
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
                        <Text style={styles.textName}>{"Date start"}</Text>
                        <TouchableOpacity onPress={() => {setStart(true); setShowDatePicker(true); setNotChanged(false)}}  style={styles.Button}>
                            <Text>{date ? `${formatDate(date)}` : "Select Date"}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"Start time*"}</Text>
                        <TouchableOpacity onPress={() => {setStart(true); setShowTimePicker(true); }} style={styles.Button}>
                            <Text>{starttime ? `${starttime}` : "Select Time"}</Text>
                        </TouchableOpacity>
                     </View>
                </View>

                <View style={styles.containerDateTime}>
                    <View style={styles.containerText}>
                    <Text style={styles.textName}>{"Date end*"}</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.Button}>
                        <Text>{dateEnd ? `${formatDate(dateEnd)}` : "Select Date"}</Text>
                    </TouchableOpacity>
                    </View>

                    <View style={styles.containerText}>
                        <Text style={styles.textName}>{"End time*"}</Text>
                        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.Button}>
                            <Text>{endtime ? `${endtime}` : "Select Time"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {showDatePicker && (
                    <RNDateTimePicker
                        mode="date"
                        display="default"
                        value={start ? new Date(`${formatDate(date)}T00:00:00.000Z`) : new Date(`${formatDate(dateEnd)}T00:00:00.000Z`)}
                        onChange={onDateChange}
                    />
                )}

                {showTimePicker && (
                    <RNDateTimePicker
                        mode="time"
                        display="default"
                        value={start ? new Date(`${formatDate(date)}T${starttime}:00.000Z`) : new Date(`${formatDate(dateEnd)}T${endtime}:00.000Z`)}
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
                    <TouchableOpacity onPress={updateEvent} style={styles.createButton}>
                        <Text style={styles.ButtonText}>Edit event</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.containerButton}>
                    <TouchableOpacity onPress={() => {navigation.navigate("Events"); }} style={styles.deleteButton}>
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

        textExp: {
                color: '#888',
                paddingBottom: 10,
                fontSize: 15,
                paddingLeft: 15,
        },

        containerText: {
            flex: 1,
            padding: 10,
            justifyContent: 'flex-start',
        },

        containerDateTime: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
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
        Button: {
            flex: 1,
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#FEFAE0',
            borderRadius: 8,
            marginHorizontal: 5,
        },
    }
);