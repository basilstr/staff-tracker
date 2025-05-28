import {ref} from "vue";
import scheduleService from "../../services/scheduleService.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);


export function useCaseSetSchedulesGroup(schedulesStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const setSchedulesGroup = async (unit, date, status) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            let res = await scheduleService.setGroup(unit, date, date, {
                date: date,
                status: status,
            }, abortController.signal);
            schedulesStore.setSchedules(res)
        } catch (err) {
            console.log(err)
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

    return {loading, error, authError, setSchedulesGroup, cancelRequest};
}
