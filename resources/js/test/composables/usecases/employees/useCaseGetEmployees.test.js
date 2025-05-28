import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useCaseGetEmployees } from '../../../../src/composables/usecases/employees/useCaseGetEmployees';
import employeeService from '../../../../src/composables/services/employeeService';
import employeesStore from '../../../../src/composables/store/employeesStore';

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        getEmployees: vi.fn(),
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

describe('useCaseGetEmployees', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const { loading, error, authError } = useCaseGetEmployees(employeesStore);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у employeesStore', async () => {
        const { fetchEmployees, loading, error } = useCaseGetEmployees(employeesStore);

        const mockData = [
            {
                id: "employee.id 1",
                user_id: "employee.user_id 1",
                unit_id: "employee.unit_id 1",
                name: "employee.name 1",
                rank: "employee.rank 1",
                note: "employee.note 1",
                text_color: "employee.text_color 1",
                bg_color: "employee.bg_color 1",
                sort: "employee.sort 1",
                hidden: 0,
            }, {
                id: "employee.id 2",
                user_id: "employee.user_id 2",
                unit_id: "employee.unit_id 2",
                name: "employee.name 2",
                rank: "employee.rank 2",
                note: "employee.note 2",
                text_color: "employee.text_color 2",
                bg_color: "employee.bg_color 2",
                sort: "employee.sort 2",
                hidden: 1,
            },
        ];
        employeeService.getEmployees.mockResolvedValue(mockData);

        const unit = 3
        await fetchEmployees(unit);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        const returnData = [
            {
                id: "employee.id 1",
                userId: "employee.user_id 1",
                unitId: "employee.unit_id 1",
                name: "employee.name 1",
                rank: "employee.rank 1",
                note: "employee.note 1",
                textColor: "employee.text_color 1",
                bgColor: "employee.bg_color 1",
                sort: "employee.sort 1",
                hidden: false,
            }, {
                id: "employee.id 2",
                userId: "employee.user_id 2",
                unitId: "employee.unit_id 2",
                name: "employee.name 2",
                rank: "employee.rank 2",
                note: "employee.note 2",
                textColor: "employee.text_color 2",
                bgColor: "employee.bg_color 2",
                sort: "employee.sort 2",
                hidden: true,
            },
        ];
        expect(employeesStore.setEmployees).toHaveBeenCalledWith(returnData, unit);
    });

    test('перевірка чи unit встановлено', async () => {
        const { fetchEmployees, loading, error } = useCaseGetEmployees(employeesStore);

        await fetchEmployees(null);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(employeeService.getEmployees).not.toHaveBeenCalled();
    });

    test('якщо employeesStore не порожній, не виконує запит', async () => {
        employeesStore.isEmptyEmployees.mockReturnValue(false);

        const { fetchEmployees, loading } = useCaseGetEmployees(employeesStore);

        const unit = 3
        await fetchEmployees(unit);

        expect(employeeService.getEmployees).not.toHaveBeenCalled();
        expect(loading.value).toBe(false);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const { fetchEmployees, authError } = useCaseGetEmployees(employeesStore);

        employeeService.getEmployees.mockRejectedValue(new Error('AuthError'));

        const unit = 3
        await fetchEmployees(unit);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const { fetchEmployees, error } = useCaseGetEmployees(employeesStore);

        employeeService.getEmployees.mockRejectedValue(new Error('Server Error'));

        const unit = 3
        await fetchEmployees(unit);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const { fetchEmployees, cancelRequest, loading } = useCaseGetEmployees(employeesStore);

        employeeService.getEmployees.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 3
        fetchEmployees(unit);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const { fetchEmployees, cancelRequest, loading } = useCaseGetEmployees(employeesStore);

        employeeService.getEmployees.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const unit = 3
        fetchEmployees(unit);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
