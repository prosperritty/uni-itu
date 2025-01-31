/**
 * File for main navigation between screens(stack screens)
 * This is bottom bar in application
 *
 * @author Albert Tikaiev
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './HomeNav'
import EventStackScreen from "./EventNav";
import TaskStackScreen from "./TaskNav";
import FinanceStackScreen from "./FinanceNav";
import {Image, StyleSheet} from "react-native";
import config from "../config";
import ProfileStackScreen from "./ProfileNav";

const Tab = createBottomTabNavigator();

export default function BottomBar() {
    return(
        <Tab.Navigator screenOptions={({route}) => ({
            headerShown:false,
            tabBarIcon : () => {
                let home = require('../assets/home.png');
                let task = require('../assets/task.png');
                let event = require('../assets/event.png');
                let finance = require('../assets/finance.png');
                if (route.name === "HomeStack") return <Image source={home} style={styles.icon}/>
                if (route.name === "TasksStack") return <Image source={task} style={styles.icon}/>
                if (route.name === "EventsStack") return <Image source={event} style={styles.icon}/>
                if (route.name === "FinanceStack") return <Image source={finance} style={styles.icon}/>
            },
            tabBarStyle: styles.tabBar,
        })}>
            <Tab.Screen name="HomeStack" options={{title: 'Home'}} component={HomeStackScreen}/>
            <Tab.Screen name="TasksStack" options={{title: 'Tasks'}} component={TaskStackScreen}/>
            <Tab.Screen name="EventsStack" options={{title: 'Events'}} component={EventStackScreen}/>
            <Tab.Screen name="FinanceStack" options={{title: 'Finance'}} component={FinanceStackScreen}/>
            {/*Hide this profile because its already on top*/}
            <Tab.Screen name="ProfileStack" options={{title: 'Profile', tabBarButton: () => null}} component={ProfileStackScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    icon:{
        width:24,
        height:24,
        resizeMode: 'contain'
    },
    tabBar: {
      backgroundColor: config.colors.topbottom,
    },
})
