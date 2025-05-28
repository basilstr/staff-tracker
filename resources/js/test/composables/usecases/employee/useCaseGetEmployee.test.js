import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseGetEmployee} from '../../../../src/composables/usecases/emploee/useCaseGetEmployee';
import employeeService from '../../../../src/composables/services/employeeService';
import employeesStore from '../../../../src/composables/store/employeesStore';

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        getEmployee: vi.fn(),
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

describe('useCaseGetEmployee', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError, employee} = useCaseGetEmployee(employeesStore);

        expect(employee.value).toStrictEqual({});
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у employee', async () => {
        const {fetchEmployee, loading, error, employee} = useCaseGetEmployee(employeesStore);

        const mockData = {
                id: 5,
                user_id: null,
                unit_id: 1,
                rank: 6,
                name: "OWNER",
                note: "note note note",
                text_color: "#000000",
                bg_color: "#ff0000",
                sort: 0,
                hidden: false,
            };
        employeesStore.getEmployee.mockReturnValue(null);
        employeeService.getEmployee.mockResolvedValue(mockData);

        const id = 5
        await fetchEmployee(id);

        expect(employee.value).toStrictEqual({
            id: 5,
            userId: null,
            unitId: 1,
            rank: 6,
            name: "OWNER",
            note: "note note note",
            textColor: "#000000",
            bgColor: "#ff0000",
            sort: 0,
            hidden: false,
        });
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
    });

    test('якщо employeesStore не порожній, не виконує запит', async () => {
        employeesStore.getEmployee.mockReturnValue(
            {
                id: 1,
                userId: null,
                unitId: 1,
                rank: 6,
                name: "OWNER",
                note: "note note note",
                textColor: "#000000",
                bgColor: "#ff0000",
                sort: 0
            }
        );

        const {fetchEmployee, loading} = useCaseGetEmployee(employeesStore);

        const id = 5
        await fetchEmployee(id);

        expect(employeeService.getEmployee).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {fetchEmployee, authError} = useCaseGetEmployee(employeesStore);

        employeeService.getEmployee.mockRejectedValue(new Error('AuthError'));

        const id = 5
        await fetchEmployee(id);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {fetchEmployee, error} = useCaseGetEmployee(employeesStore);

        employeeService.getEmployee.mockRejectedValue(new Error('Server Error'));

        const id = 5
        await fetchEmployee(id);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {fetchEmployee, cancelRequest, loading} = useCaseGetEmployee(employeesStore);

        employeeService.getEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const id = 5
        fetchEmployee(id);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {fetchEmployee, cancelRequest, loading} = useCaseGetEmployee(employeesStore);

        employeeService.getEmployee.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const id = 5
        fetchEmployee(id);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
