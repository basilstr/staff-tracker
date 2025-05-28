import {ref} from "vue";
import userService from "../../services/userService.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseLogin() {
    const success = ref(false);
    const loading = ref(null);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const login = async (email, password, google_token, invite) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            let res = await userService.login({
                email: email,
                password: password,
                google_token: google_token,
                invite: invite,
            }, abortController.signal)
            localStorage.setItem("token", res.token)
            localStorage.setItem("userId", res.user_id)
            localStorage.setItem("userName", res.name)
            localStorage.setItem("userEmail", res.email)
            success.value = true
        } catch (err) {
            success.value = false

            localStorage.removeItem("token")
            localStorage.removeItem("userId")
            localStorage.removeItem("userName")
            localStorage.removeItem("userEmail")

            if (err.message === 'canceled') {
                if (debugMode) console.log('Запит login() скасовано');
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

    return {success, loading, error, authError, login, cancelRequest};
}
