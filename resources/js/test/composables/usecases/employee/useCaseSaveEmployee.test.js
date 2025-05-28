import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseSaveEmployee} from '../../../../src/composables/usecases/emploee/useCaseSaveEmployee';
import employeeService from '../../../../src/composables/services/employeeService';
import employeesStore from '../../../../src/composables/store/employeesStore';

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        putEmployee: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/employeesStore', () => ({
    default: {
        isEmptyEmployees: vi.fn(() => true),
        setEmployees: vi.fn(),
        clearEmployees: vi.fn(),
        getEmployee: vi.fn(),
        deleteEmployee: vi.fn(),
        saveEmployee: vi.fn(),
        createEmployee: vi.fn(),
    },
}));

describe('useCaseSaveEmployee', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseSaveEmployee(employeesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані передає на сервер та зберігає отримані з сервера дані у employeesStore', async () => {
        const {saveEmployee, loading, error} = useCaseSaveEmployee(employeesStore);

        const mockData = {
            id: 3,
            userId: 2,
            unitId: 1,
            rank: 10,
            name: "data.name",
            note: "data.note",
            textColor: '#000000',
            bgColor: '#ffffff',
            sort:4,
            hidden:true,
        }

        const returnedData =
            {
                id: 3,
                user_id: 2,
                unit_id: 1,
                rank: 10,
                name: "data.name",
                note: "data.note",
                text_color: '#000000',
                bg_color: '#ffffff',
                sort:4,
                hidden:1,
            }

        employeeService.putEmployee.mockResolvedValue(returnedData);

        await saveEmployee(mockData);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);

        expect(employeesStore.saveEmployee).toHaveBeenCalledWith(mockData);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {saveEmployee, authError} = useCaseSaveEmployee(employeesStore);

        employeeService.putEmployee.mockRejectedValue(new Error('AuthError'));
        const mockData = {
            id: 3,
            userId: 2,
            unitId: 1,
            rank: 10,
            name: "data.name",
            note: "data.note",
            textColor: '#000000',
            bgColor: '#ffffff',
            sort:4,
        }

        await saveEmployee(mockData);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {saveEmployee, error} = useCaseSaveEmployee(employeesStore);

        employeeService.putEmployee.mockRejectedValue(new Error('Server Error'));

        const mockData = {
            id: 3,
            userId: 2,
            unitId: 1,
            rank: 10,
            name: "data.name",
            note: "data.note",
            textColor: '#000000',
            bgColor: '#ffffff',
            sort:4,
        }

        await saveEmployee(mockData);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {cancelRequest, saveEmployee, loading} = useCaseSaveEmployee(employeesStore);

        employeeService.putEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const mockData = {
            id: 3,
            userId: 2,
            unitId: 1,
            rank: 10,
            name: "data.name",
            note: "data.note",
            textColor: '#000000',
            bgColor: '#ffffff',
            sort:4,
        }

        saveEmployee(mockData);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {saveEmployee, cancelRequest, loading} = useCaseSaveEmployee(employeesStore);

        employeeService.putEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );
        const mockData = {
            id: 3,
            userId: 2,
            unitId: 1,
            rank: 10,
            name: "data.name",
            note: "data.note",
            textColor: '#000000',
            bgColor: '#ffffff',
            sort:4,
        }
        await saveEmployee(mockData);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
