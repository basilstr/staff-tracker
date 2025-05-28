import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseDeleteEmployee} from '../../../../src/composables/usecases/emploee/useCaseDeleteEmployee';
import employeeService from '../../../../src/composables/services/employeeService';
import employeesStore from '../../../../src/composables/store/employeesStore';
import {ref} from "vue";

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        deleteEmployee: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/employeesStore', () => ({
    default: {
        isEmptyEmployees: vi.fn(() => true),
        setEmployees: vi.fn(),
        clearEmployees: vi.fn(),
        getEmployee: vi.fn(),
        createEmployee: vi.fn(),
        saveEmployee: vi.fn(),
        deleteEmployee: vi.fn(),
    },
}));

describe('useCaseDeleteEmployee', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseDeleteEmployee(employeesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('видалення employee', async () => {
        const {deleteEmployee, loading, error, } = useCaseDeleteEmployee(employeesStore);

        await deleteEmployee(1);

        expect(employeesStore.deleteEmployee).toHaveBeenCalledWith(1);
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
    });

    test('видалення employee з встановленням прапорця успішного видалення', async () => {
        const {deleteEmployee, loading, error, } = useCaseDeleteEmployee(employeesStore);

        const del = ref(null)
        await deleteEmployee(1, del);

        expect(employeesStore.deleteEmployee).toHaveBeenCalledWith(1);
        expect(del.value).toBe(true);
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {deleteEmployee, authError} = useCaseDeleteEmployee(employeesStore);

        employeeService.deleteEmployee.mockRejectedValue(new Error('AuthError'));

        await deleteEmployee(1);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError та прапорець', async () => {
        const {deleteEmployee, authError} = useCaseDeleteEmployee(employeesStore);

        employeeService.deleteEmployee.mockRejectedValue(new Error('AuthError'));

        const del = ref(null)
        await deleteEmployee(1, del);

        expect(authError.value).toBe(true);
        expect(del.value).toBe(false);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {deleteEmployee, error} = useCaseDeleteEmployee(employeesStore);

        employeeService.deleteEmployee.mockRejectedValue(new Error('Server Error'));

        await deleteEmployee(1);

        expect(error.value).toBe('Server Error');
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error та прапорець', async () => {
        const {deleteEmployee, error} = useCaseDeleteEmployee(employeesStore);

        employeeService.deleteEmployee.mockRejectedValue(new Error('Server Error'));

        const del = ref(null)
        await deleteEmployee(1, del);

        expect(error.value).toBe('Server Error');
        expect(del.value).toBe(false);
    });

    test('скасовує запит через AbortController', async () => {
        const {deleteEmployee, cancelRequest, loading} = useCaseDeleteEmployee(employeesStore);

        employeeService.deleteEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        deleteEmployee(1);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {deleteEmployee, cancelRequest, loading} = useCaseDeleteEmployee(employeesStore);

        employeeService.deleteEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        deleteEmployee(1);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
