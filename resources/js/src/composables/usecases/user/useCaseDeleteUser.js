import {ref} from "vue";
import userService from "../../services/userService.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseDeleteUser() {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const deleteUser = async (deleted = null) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            await userService.deleteUser(abortController.signal);
            if(deleted) deleted.value = true
            localStorage.removeItem("token")
        } catch (err) {
            if(deleted) deleted.value = false
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит deleteUser() скасовано');
            } else if (err.message === 'AuthError') {
                if(debugMode) console.log('Помилка авторизації');
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

    return {loading, error, authError, deleteUser, cancelRequest};
}
