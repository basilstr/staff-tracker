import {ref} from "vue";
import userService from "../../services/userService.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseSendInvite() {
    const message = ref('');
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const sendInvite = async (invite) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            let res = await userService.sendInvite({invite: invite}, abortController.signal);
            message.value = res.message
        } catch (err) {
            if (err.message === 'canceled') {
                if (debugMode) console.log('Запит saveUser() скасовано');
            } else if (err.message === 'AuthError') {
                if (debugMode) console.log('Помилка авторизації');
                authError.value = true
            } else {
                error.value = err.message;
            }
        } finally {
            loading.value = false;
        }
    };

    // Функція для скасування запиту
    const cancelRequest = () => {
        if (!loading.value) return
        if (abortController) abortController.abort();
        loading.value = false;
    };

    return {message, loading, error, authError, sendInvite, cancelRequest};
}
