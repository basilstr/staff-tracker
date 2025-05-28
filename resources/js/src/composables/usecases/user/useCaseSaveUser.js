import {ref} from "vue";
import userService from "../../services/userService.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseSaveUser() {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const saveUser = async (name, password, saved = null) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            await userService.saveUser({
                    name: name,
                    password: password,
                }, abortController.signal);

            localStorage.setItem("userName", name)
            if (saved) saved.value = true
        } catch (err) {
            if (saved) saved.value = false
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

    return {loading, error, authError, saveUser, cancelRequest};
}
