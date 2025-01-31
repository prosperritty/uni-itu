/**
 * File for navigation between screens on Home screen stack
 *
 * @author Albert Tikaiev
 */

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "../screens/Home";
import TaskCreation from "../screens/TaskCreation";
import EventCreation from "../screens/EventCreation";
import EditTask from "../screens/EditTask";
import {StyleSheet} from "react-native";
import config from "../config";
import TopBarAvatar from "../components/TopBarAvatar";
import JarCreation from "../screens/JarCreation";

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{headerStyle: TopBarStyles.topBar}}>

            <HomeStack.Screen name="Home" options={({navigation}) => ({
                headerTitle: 'DoFam Home',
                headerTitleAlign: 'center',
                headerRight: () =>  <TopBarAvatar callback={() => navigation.navigate('ProfileStack')}/>,
            })}
            component={Home}/>

            <HomeStack.Screen name="TaskCreation" options={{
                headerTitle: 'Create task',
                headerTitleAlign: 'center',
            }}
            component={TaskCreation} />

            <HomeStack.Screen name="EventCreation" options={{
                headerTitle: 'Create event',
                headerTitleAlign: 'center',
            }}
            component={EventCreation} />

            <HomeStack.Screen name="JarCreation" options={{
                headerTitle: 'Create jar',
                headerTitleAlign: 'center',
            }}
            component={JarCreation} />

            <HomeStack.Screen name="EditTask" options={{
                headerTitle: 'Edit task',
                headerTitleAlign: 'center',
            }}
            component={EditTask} />

        </HomeStack.Navigator>
    );
}

export const TopBarStyles = StyleSheet.create({
    topBar:{
        backgroundColor: config.colors.topbottom,
    }
})