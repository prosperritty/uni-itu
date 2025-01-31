/**
 * File for navigation between screens on Task screen stack
 *
 * @author Albert Tikaiev
 */

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Tasks from "../screens/Tasks";
import TaskCreation from "../screens/TaskCreation";
import EditTask from "../screens/EditTask";
import {TopBarStyles} from './HomeNav'
import TopBarAvatar from "../components/TopBarAvatar";

const TaskStack = createNativeStackNavigator();

export default function TaskStackScreen() {
    return (
        <TaskStack.Navigator screenOptions={{headerStyle: TopBarStyles.topBar}}>

            <TaskStack.Screen  name="Tasks" options={({navigation}) => ({
                headerTitle: 'Tasks',
                headerTitleAlign: 'center',
                headerRight: () =>  <TopBarAvatar callback={() => navigation.navigate('ProfileStack')}/>,
            })}
            component={Tasks}/>

            <TaskStack.Screen name="TaskCreation" options={{
                headerTitle: 'Create task',
                headerTitleAlign: 'center',
            }}
            component={TaskCreation} />

            <TaskStack.Screen name="EditTask" options={{
                headerTitle: 'Edit task',
                headerTitleAlign: 'center',
            }}
            component={EditTask} />

        </TaskStack.Navigator>
    );
}