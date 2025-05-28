import {describe, it, expect, vi, beforeEach, test} from 'vitest';
import {useCaseSaveUser} from "../../../../src/composables/usecases/user/useCaseSaveUser";
import {ref} from "vue";
import userService from "../../../../src/composables/services/userService";

vi.mock('../../../../src/composables/services/userService', () => ({
    default: {
        saveUser: vi.fn()
    }
}));

describe('useCaseSaveUser', () => {
    let mockStorage = {};

    beforeEach(() => {
        vi.resetAllMocks();

        // Мокаємо localStorage
        mockStorage = {userId: '2'};

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
        const {loading, error, authError} = useCaseSaveUser();

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    test('отримує дані передає на сервер ', async () => {
        const {saveUser, loading, error} = useCaseSaveUser();

        await saveUser('name', 'pass');

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);

        expect(localStorage.getItem('userName')).toBe('name');
    });

    test('отримує дані передає на сервер з прапорце збереження ', async () => {
        const {saveUser, loading, error} = useCaseSaveUser();

        const saved = ref(null)
        await saveUser('name', 'pass', saved);

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(saved.value).toBe(true);

        expect(localStorage.getItem('userName')).toBe('name');
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {saveUser, authError} = useCaseSaveUser();

        userService.saveUser.mockRejectedValue(new Error('AuthError'));

        await saveUser('name', 'pass');

        expect(authError.value).toBe(true);
    });


    test('якщо сервер повертає помилку авторизації, встановлює authError з прапорцем', async () => {
        const {saveUser, authError} = useCaseSaveUser();

        userService.saveUser.mockRejectedValue(new Error('AuthError'));

        const saved = ref(null)
        await saveUser('name', 'pass', saved);

        expect(authError.value).toBe(true);
        expect(saved.value).toBe(false);
    });

    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {saveUser, error} = useCaseSaveUser();

        userService.saveUser.mockRejectedValue(new Error('Server Error'));

        await saveUser('name', 'pass');
        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {cancelRequest, saveUser, loading} = useCaseSaveUser();

        userService.saveUser.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        saveUser('name', 'pass');
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {saveUser, cancelRequest, loading} = useCaseSaveUser();

        userService.saveUser.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );
        await saveUser('name', 'pass');
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
