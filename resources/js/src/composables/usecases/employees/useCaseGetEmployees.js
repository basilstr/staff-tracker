import {ref} from "vue";
import employeeService from "../../services/employeeService.js";
import employeesMaps from "./employeesMaps.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseGetEmployees(employeesStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchEmployees = async (unit_id) => {
        if(!unit_id) return

        loading.value = true
        error.value = null
        abortController = new AbortController();

        if (!employeesStore.isEmptyEmployees(unit_id)) {
            if (debugMode) console.log('отримання членів групи з сховища');
            loading.value = false;
            return
        }

        try {
            let res = await employeeService.getEmployees(unit_id, abortController.signal);
            res = employeesMaps.toClient(res)
            res.sort((a, b) => a.sort - b.sort)
            employeesStore.setEmployees(res, unit_id)
        } catch (err) {
            if (err.message === 'canceled') {
                if (debugMode) console.log('Запит getEmployees() скасовано');
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
    return {loading, error, authError, fetchEmployees, cancelRequest};
}
