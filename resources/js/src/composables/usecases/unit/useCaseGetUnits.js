import {ref} from "vue";
import unitService from "../../services/unitService.js";
import unitsMaps from "./unitsMaps.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseGetUnits(unitsStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchUnits = async () => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        if (!unitsStore.isEmptyUnits()) {
            if (debugMode) console.log('отримання груп з сховища');
            loading.value = false;
            return
        }

        try {
            let res = await unitService.getUnits(abortController.signal);
            res = unitsMaps.toClient(res)
            res.sort((a, b) => a.sort - b.sort)
            unitsStore.setUnits(res)
        } catch (err) {
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит getUnits() скасовано');
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

    return {loading, error, authError, fetchUnits, cancelRequest};
}
