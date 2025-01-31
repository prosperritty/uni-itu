//@author Olha Tomylko

import {View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native";
import {useState, useEffect} from "react";
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import config from "../config";
import Task from "../components/Task";
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from "../userstate/UserContext";

export default function Tasks({navigation, route}) {

    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState(null);

    // State to manage dropdown visibility
    const [open, setOpen] = useState(false);

    // Available filter options
    const [items] = useState([
        { label: 'By priority', value: 'priority' },
        { label: 'By deadline', value: 'deadline' },
        { label: 'Only done', value: 'done' },
    ]);

    const [userInfo, setUserInfo] = useState(null);
        const {user} = useUser();

    async function getUser() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(config.api+`/user/${userId}`);
        setUserInfo(request.data);
    }


    async function getTask() {
        const userId = route.params?.id ? route.params.id : user.id;
        const request = await axios.get(`${config.api}/tasks/${userId}`, {
            params: { filter },
        });
        setTasks(request.data);

    }

    function refreshTasks() {
        getTask();
    }

    // Fetch tasks whenever the screen is focused or filter changes
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getTask(filter);
        });

        getTask(filter);

        return unsubscribe;
    }, [navigation, filter]);

    useEffect(() => {
        getUser();
    }, []);

    return (
        userInfo ?
        <View style={{ flex: 1 }}>
                    <DropDownPicker
                        open={open}
                        value={filter}
                        items={items}
                        setOpen={setOpen}
                        setValue={setFilter}
                        placeholder="Choose filter"
                        containerStyle={{ height: 40, margin: 15, width: '93%'}}
                    />
                <ScrollView>

                    <View style={styles.containerTasks}>
                        <View style={{ width: '100%' }}>
                            {tasks.map((task, index) =>
                                <Task key={index} task={task} userInfo={userInfo}refreshTasks={refreshTasks}/>
                            )}
                        </View>
                    </View>
                    <View style={styles.containerScroll}>
                    </View>
                </ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TaskCreation", { userInfo })}>
                        <Text style={styles.plus}>+</Text>
                    </TouchableOpacity>
                </View>

        </View>
        :
        // Loading indicator if user info is not loaded yet
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
        enterF: {
                color: '#000000',
                paddingBottom: 10,
                fontSize: 17,
        },

        containerTasks: {
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