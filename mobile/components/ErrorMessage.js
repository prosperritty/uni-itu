/**
 * File for error message displaying as vanishing window on top
 *
 * @author Albert Tikaiev
 */

import Toast, {ErrorToast} from "react-native-toast-message";

export const toastConfig = {
    error: (props) => (
        <ErrorToast
            {...props}
            contentContainerStyle={{ padding: 15 }}
            text1Style={{
                fontSize: 18
            }}
            text2Style={{
                fontSize: 12
            }}
        />
    )
};

/**
 * @param message Message describing error
 */
export default function ErrorMessage(message) {
    const showToast = () => {
        Toast.show({
            type: 'error',
            text1: message,
            text2: 'Try again',
            timeout: 2500,
        });
    }
    showToast();
}