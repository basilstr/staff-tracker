import {describe, it, expect, vi, beforeEach, test} from 'vitest';
import {useCaseDeleteUser} from "../../../../src/composables/usecases/user/useCaseDeleteUser";
import {ref} from "vue";
import userService from "../../../../src/composables/services/userService";

vi.mock('../../../../src/composables/services/userService', () => ({
    default: {
        deleteUser: vi.fn()
    }
}));

describe('useCaseDeleteUser', () => {
    vi.resetAllMocks();

    let mockStorage = {};

    beforeEach(() => {

        // Мокаємо localStorage
        mockStorage = {token: 'token'};

        vi.stubGlobal('localStorage', {
            getItem: vi.fn((key) => mockStorage[key] ?? null),
            setItem: vi.fn((key, value) => {
                mockStorage[key] = value;
            }),
            removeItem: vi.fn((key) => {
                delete mockStorage[key];
            }),
            clear: vi.fn(() => {
                mockStorage = {};
            }),
        });
    });

    test('початкові значення змінних ref()', () => {
        const {loading, error, authError} = useCaseDeleteUser();

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
        expect(localStorage.getItem('token')).toBe('token');
    });

    test('отримує дані передає на сервер ', async () => {
        const {deleteUser, loading, error} = useCaseDeleteUser();

        expect(localStorage.getItem('token')).toBe('token');

        await deleteUser();

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);

        expect(localStorage.getItem('token')).toBe(null);
    });

    test('отримує дані передає на сервер з прапорця видалення', async () => {
        const {deleteUser, loading, error} = useCaseDeleteUser();

        const deleted = ref(null)
        await deleteUser(deleted);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(deleted.value).toBe(true);

        expect(localStorage.getItem('token')).toBe(null);
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {deleteUser, authError} = useCaseDeleteUser();

        userService.deleteUser.mockRejectedValue(new Error('AuthError'));

        await deleteUser();

        expect(authError.value).toBe(true);
    });


    test('якщо сервер повертає помилку авторизації, встановлює authError з прапорцем', async () => {
        const {deleteUser, authError} = useCaseDeleteUser();

        userService.deleteUser.mockRejectedValue(new Error('AuthError'));

        const deleted = ref(null)
        await deleteUser(deleted);

        expect(authError.value).toBe(true);
        expect(deleted.value).toBe(false);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {deleteUser, error} = useCaseDeleteUser();

        userService.deleteUser.mockRejectedValue(new Error('Server Error'));

        await deleteUser();
        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {cancelRequest, deleteUser, loading} = useCaseDeleteUser();

        userService.deleteUser.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        deleteUser();
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {deleteUser, cancelRequest, loading} = useCaseDeleteUser();

        userService.deleteUser.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );
        await deleteUser();
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
