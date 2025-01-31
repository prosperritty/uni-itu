/**
 * File for navigation between screens on Profile screen stack
 *
 * @author Albert Tikaiev
 */

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import {TopBarStyles} from "./HomeNav";
import AllUsers from "../screens/AllUsers";

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackScreen() {
    return(
        <ProfileStack.Navigator screenOptions={{headerStyle: TopBarStyles.topBar}}>

            <ProfileStack.Screen name="Profile" options={{
                headerTitle: 'My profile',
                headerTitleAlign: 'center',
            }}
            component={Profile} />

            <ProfileStack.Screen name="AllUsers" options={{
                headerTitle: 'All members',
                headerTitleAlign: 'center',
            }}
            component={AllUsers}/>

            <ProfileStack.Screen name="ProfileOther" options={{
                headerTitle: 'Profile',
                headerTitleAlign: 'center',
            }}
            component={Profile} />

        </ProfileStack.Navigator>
    );
}