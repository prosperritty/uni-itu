/**
 * File for navigation between screens on Event screen stack
 *
 * @author Albert Tikaiev
 */

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Events from "../screens/Events";
import EditEvent from "../screens/EditEvent";
import EventCreation from "../screens/EventCreation";
import {TopBarStyles} from './HomeNav'
import TopBarAvatar from "../components/TopBarAvatar";

const EventStack = createNativeStackNavigator();

export default function EventStackScreen() {
    return (
        <EventStack.Navigator screenOptions={{headerStyle: TopBarStyles.topBar}}>

            <EventStack.Screen name="Events" options={({navigation}) => ({
                headerTitle: 'Events',
                headerTitleAlign: 'center',
                headerRight: () =>  <TopBarAvatar callback={() => navigation.navigate('ProfileStack')}/>,
            })}
            component={Events}/>

            <EventStack.Screen name="EventCreation" options={{
                headerTitle: 'Create event',
                headerTitleAlign: 'center',
            }}
            component={EventCreation} />

            <EventStack.Screen name="EditEvent" options={{
                headerTitle: 'Edit event',
                headerTitleAlign: 'center',
            }}
            component={EditEvent} />

        </EventStack.Navigator>
    );
}