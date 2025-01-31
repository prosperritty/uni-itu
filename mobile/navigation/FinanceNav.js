/**
 * File for navigation between screens on Finance screen stack
 *
 * @author Albert Tikaiev
 */

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Finance from "../screens/Finance";
import JarCreation from "../screens/JarCreation";
import TopBarAvatar from "../components/TopBarAvatar";
import {TopBarStyles} from './HomeNav'
import TransactionList from "../screens/TransactionList";
import Jar from "../screens/Jar";

const FinanceStack = createNativeStackNavigator();

export default function FinanceStackScreen() {
    return (
        <FinanceStack.Navigator screenOptions={{headerStyle: TopBarStyles.topBar}}>

            <FinanceStack.Screen name="Finance" options={({navigation}) => ({
                headerTitle: 'Finance',
                headerTitleAlign: 'center',
                headerRight: () =>  <TopBarAvatar callback={() => navigation.navigate('ProfileStack')}/>,
            })}
            component={Finance} />

            <FinanceStack.Screen name="JarCreation" options={{
                headerTitle: 'Create jar',
                headerTitleAlign: 'center',
            }}
            component={JarCreation} />

            <FinanceStack.Screen name="Jar" options={{
                headerTitle: 'Jar',
                headerTitleAlign: 'center',
            }}
            component={Jar} />

            <FinanceStack.Screen name="TransactionList" options={{
                headerTitle: 'All transactions',
                headerTitleAlign: 'center',
            }}
            component={TransactionList} />

        </FinanceStack.Navigator>
    );
}