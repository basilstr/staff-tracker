import {describe, test, expect, vi, beforeEach} from 'vitest';
import {useCaseGetInviteUser} from '../../../../src/composables/usecases/user/useCaseGetInviteUser';
import userService from "../../../../src/composables/services/userService";

vi.mock('../../../../src/composables/services/userService', () => ({
    default: {
        getInvite: vi.fn()
    }
}));


describe('useCaseGetInviteUser', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError, invite} = useCaseGetInviteUser();

        expect(invite.value).toStrictEqual('');
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані та зберігає їх у invite', async () => {
        const {fetchInvite, loading, error, invite} = useCaseGetInviteUser();

        const mockData = {
            invite: 'qwerty',
            expired_at: '2025-12-12',
        };

        userService.getInvite.mockResolvedValue(mockData);

        await fetchInvite();

        expect(invite.value).toStrictEqual({
            invite: 'http://test.site/login/qwerty',
            expiredAt: "2025-12-12"
        });
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {fetchInvite, authError} = useCaseGetInviteUser();

        userService.getInvite.mockRejectedValue(new Error('AuthError'));

        await fetchInvite();

        expect(authError.value).toBe(true);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {fetchInvite, error} = useCaseGetInviteUser();

        userService.getInvite.mockRejectedValue(new Error('Server Error'));

        await fetchInvite();

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {fetchInvite, cancelRequest, loading} = useCaseGetInviteUser();

        userService.getInvite.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchInvite();
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {fetchInvite, cancelRequest, loading} = useCaseGetInviteUser();

        userService.getInvite.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        fetchInvite();
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
