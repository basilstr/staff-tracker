import {ref} from "vue";
import userService from "../../services/userService.js";
import {mapClientData} from "./inviteMaps";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);


export function useCaseGetInviteUser() {
    const invite = ref('');
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchInvite = async () => {
        loading.value = true
        error.value = null
        abortController = new AbortController();
        try {
            let res = await userService.getInvite(abortController.signal);
            res = mapClientData(res)
            invite.value = res
        } catch (err) {
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит userService.getInvite() скасовано');
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

    return {invite, loading, error, authError, fetchInvite, cancelRequest};
}
