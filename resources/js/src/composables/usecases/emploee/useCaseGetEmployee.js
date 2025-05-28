import {ref} from "vue";
import employeeService from "../../services/employeeService.js";
import employeeMaps from "./employeeMaps.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseGetEmployee(employeesStore) {
    const employee = ref({});
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const fetchEmployee = async (id) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        if (employeesStore.getEmployee(id)) {
            if (debugMode) console.log('отримання одного члена групи з сховища', id);
            loading.value = false;
            employee.value = employeesStore.getEmployee(id)
            return
        }

        try {
            let res = await employeeService.getEmployee(id, abortController.signal);
            res = employeeMaps.toClient(res)
            employee.value = res
        } catch (err) {
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит getInvite() скасовано');
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

    return {employee, loading, error, authError, fetchEmployee, cancelRequest};
}
