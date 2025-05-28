import {ref} from "vue";
import reportService from "../../services/reportService.js";
import reportMaps from "./reportMaps";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseGetReport(reportStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchReport= async (unit, dateFrom, dateTo) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        if(!unit || !dateFrom || !dateTo) {
            reportStore.clearReport()
            loading.value = false;
            return
        }

        if (!reportStore.isEmptyReport(unit, dateFrom, dateTo)) {
            if (debugMode) console.log('отримання звіту з сховища');
            loading.value = false;
            return
        }

        try {
            let res = await reportService.getReport(unit, dateFrom, dateTo, abortController.signal);
            res = reportMaps.toClient(res)
            reportStore.setReport(res)
        } catch (err) {
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит getReport() скасовано');
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

    return {loading, error, authError, fetchReport, cancelRequest};
}
