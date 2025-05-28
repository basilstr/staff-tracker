import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseCreateEmployee} from '../../../../src/composables/usecases/emploee/useCaseCreateEmployee';
import employeeService from '../../../../src/composables/services/employeeService';
import employeesStore from '../../../../src/composables/store/employeesStore';

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        postEmployee: vi.fn(),
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

describe('useCaseCreateEmployee', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseCreateEmployee(employeesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у employee', async () => {
        const {createEmployee, loading, error, employee} = useCaseCreateEmployee(employeesStore);

        const mockData = {
            id: 0,
            name: "name",
            note: "note",
            sort: 5,
            rank: 40,
            text_color: '#000000',
            bg_color: '#ffffff',
            hidden: 0,
            };

        employeeService.postEmployee.mockResolvedValue(mockData);

        await createEmployee(1, "name", "note", 5, 40);

        expect(employeesStore.createEmployee).toHaveBeenCalledWith( {
            id: 0,
            name: "name",
            note: "note",
            sort: 5,
            rank: 40,
            textColor: '#000000',
            bgColor: '#ffffff',
            hidden: false,
        });
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {createEmployee, authError} = useCaseCreateEmployee(employeesStore);

        employeeService.postEmployee.mockRejectedValue(new Error('AuthError'));

        await createEmployee(1, "name", "note", 5, 40);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {createEmployee, error} = useCaseCreateEmployee(employeesStore);

        employeeService.postEmployee.mockRejectedValue(new Error('Server Error'));

        await createEmployee(1, "name", "note", 5, 40);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {createEmployee, cancelRequest, loading} = useCaseCreateEmployee(employeesStore);

        employeeService.postEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        createEmployee(1, "name", "note", 5, 40);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {createEmployee, cancelRequest, loading} = useCaseCreateEmployee(employeesStore);

        employeeService.postEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        createEmployee(1, "name", "note", 5, 40);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
