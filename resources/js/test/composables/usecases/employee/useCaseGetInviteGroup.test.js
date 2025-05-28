import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseGetInviteGroup} from '../../../../src/composables/usecases/emploee/useCaseGetInviteGroup';
import employeeService from '../../../../src/composables/services/employeeService';
import employeesStore from '../../../../src/composables/store/employeesStore';

vi.mock('../../../../src/composables/services/employeeService', () => ({
    default: {
        getInvite: vi.fn(),
    },
}));

vi.mock('../../../../src/composables/store/employeesStore', () => ({
    default: {
        isEmptyEmployees: vi.fn(() => true),
        setEmployees: vi.fn(),
        clearEmployees: vi.fn(),
        fetchInvite: vi.fn(),
        deleteEmployee: vi.fn(),
        saveEmployee: vi.fn(),
        createEmployee: vi.fn(),
    },
}));

describe('useCaseGetInviteGroup', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError, invite} = useCaseGetInviteGroup(employeesStore);

        expect(invite.value).toStrictEqual('');
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у employee', async () => {
        const {fetchInvite, loading, error, invite} = useCaseGetInviteGroup(employeesStore);

        const mockData = {
            invite: 'qwerty',
            expired_at: '2025-12-12',
            };

        employeeService.getInvite.mockResolvedValue(mockData);

        const id = 5
        await fetchInvite(id);

        expect(invite.value).toStrictEqual({
            invite: 'http://test.site/login/qwerty',
            expiredAt: "2025-12-12"
        });
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {fetchInvite, authError} = useCaseGetInviteGroup(employeesStore);

        employeeService.getInvite.mockRejectedValue(new Error('AuthError'));

        const id = 5
        await fetchInvite(id);

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {fetchInvite, error} = useCaseGetInviteGroup(employeesStore);

        employeeService.getInvite.mockRejectedValue(new Error('Server Error'));

        const id = 5
        await fetchInvite(id);

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {fetchInvite, cancelRequest, loading} = useCaseGetInviteGroup(employeesStore);

        employeeService.getInvite.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const id = 5
        fetchInvite(id);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {fetchInvite, cancelRequest, loading} = useCaseGetInviteGroup(employeesStore);

        employeeService.getInvite.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        const id = 5
        fetchInvite(id);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
