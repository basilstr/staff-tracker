import {ref, onMounted} from "vue";
import employeeService from "../../services/employeeService.js";
import ranksMaps from "./ranksMaps.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);


export function useCaseGetRanks(ranksStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchRanks = async () => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        if (!ranksStore.isEmptyRanks()) {
            if (debugMode) console.log('отримання рангів з сховища');
            loading.value = false;
            return
        }

        try {
            let res = await employeeService.getRanks(abortController.signal);
            res = ranksMaps.toClient(res)
            res.sort((a, b) => a.id - b.id)
            ranksStore.setRanks(res)
        } catch (err) {
            if (err.message === 'canceled') {
                if (debugMode) console.log('Запит getRanks() скасовано');
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

    return {loading, error, authError, fetchRanks, cancelRequest};
}
