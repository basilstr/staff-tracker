import {ref} from "vue";
import statusService from "../../services/statusService.js";
import statusesMaps from "./statusesMaps.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseGetStatuses(statusesStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchStatuses = async (unit) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        if(!unit) {
            statusesStore.clearStatuses()
            loading.value = false;
            return
        }

        if (!statusesStore.isEmptyStatuses(unit)) {
            if (debugMode) console.log('отримання статусів з сховища');
            loading.value = false;
            return
        }

        try {
            let res = await statusService.getStatuses(unit, abortController.signal);
            res = statusesMaps.toClient(res)
            res.sort((a, b) => a.sort - b.sort)
            statusesStore.setStatuses(unit, res)
        } catch (err) {
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит getStatuses() скасовано');
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

    return {loading, error, authError, fetchStatuses, cancelRequest};
}
