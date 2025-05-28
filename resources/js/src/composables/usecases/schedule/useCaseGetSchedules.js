import {ref} from "vue";
import scheduleService from "../../services/scheduleService.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);


export function useCaseGetSchedules(schedulesStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchSchedules = async (unit, dateFrom, dateTo) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            let res = await scheduleService.getSchedules(unit, dateFrom, dateTo, abortController.signal);
            schedulesStore.setSchedules(res)
        } catch (err) {
            if (err.message === 'canceled') {
                if (debugMode) console.log('Запит fetchSchedules() скасовано');
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

    return {loading, error, authError, fetchSchedules, cancelRequest};
}
