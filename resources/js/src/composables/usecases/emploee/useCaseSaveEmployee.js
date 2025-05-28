import { ref } from "vue";
import employeeService from "../../services/employeeService.js";
import employeeMaps from "./employeeMaps.js";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

export function useCaseSaveEmployee(employeesStore) {
    const loading = ref(false);
    const error = ref(null);
    const authError = ref(false);
    let abortController = null

    const saveEmployee = async (employee) => {
        loading.value = true
        error.value = null
        abortController = new AbortController();

        try {
            let res = await employeeService.putEmployee(employee.id, employeeMaps.toServer(employee), abortController.signal);
            employeesStore.saveEmployee(employeeMaps.toClient(res))
        } catch (err) {
            if (err.message === 'canceled') {
                if(debugMode) console.log('Запит putEmployee() скасовано');
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
        if(!loading.value) return
        if(abortController) abortController.abort();
        loading.value = false;
    };

    return {loading, error, authError, saveEmployee, cancelRequest };
}
