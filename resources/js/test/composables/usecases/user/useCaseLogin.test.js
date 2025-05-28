import {describe, it, expect, vi, beforeEach, test} from 'vitest';
import {useCaseLogin} from "../../../../src/composables/usecases/user/useCaseLogin";
import {setActivePinia, createPinia} from 'pinia';
import userService from '../../../../src/composables/services/userService';


vi.mock('../../../../src/composables/services/userService', () => ({
    default: {
        login: vi.fn()
    }
}));

describe('useCaseLogin', () => {
    let mockStorage = {};

    beforeEach(() => {
        vi.resetAllMocks();

        setActivePinia(createPinia());
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

    it('should successfully login and store user data', async () => {
        const mockResponse = {
            token: 'test-token',
            user_id: '123',
            name: 'Test User',
            email: 'test@example.com'
        };
        userService.login.mockResolvedValue(mockResponse);

        const {success, loading, error, authError, login} = useCaseLogin();
        expect(success.value).toBe(false);
        expect(loading.value).toBe(null);

        await login('test@example.com', 'password', null, null);

        expect(localStorage.getItem('token')).toBe('test-token');
        expect(localStorage.getItem('userId')).toBe('123');
        expect(localStorage.getItem('userName')).toBe('Test User');
        expect(localStorage.getItem('userEmail')).toBe('test@example.com');
        expect(success.value).toBe(true);
        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
    });

    it('should handle authentication error', async () => {
        userService.login.mockRejectedValue(new Error('AuthError'));

        const {success, loading, error, authError, login} = useCaseLogin();
        await login('test@example.com', 'password', null, null);

        expect(success.value).toBe(false);
        expect(authError.value).toBe(true);
        expect(error.value).toBe(null);
        expect(localStorage.getItem('token')).toBe(null);
    });

    it('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        userService.login.mockRejectedValue(new Error('Server Error'));

        const {success, loading, error, authError, login} = useCaseLogin();
        await login('test@example.com', 'password', null, null);

        expect(success.value).toBe(false);
        expect(authError.value).toBe(false);
        expect(error.value).toBe('Server Error');
        expect(localStorage.getItem('token')).toBe(null);
    });


    test('скасовує запит через AbortController', async () => {
        const {loading, login, cancelRequest} = useCaseLogin();

        userService.login.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        login('test@example.com', 'password', null, null);
        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const { login, cancelRequest, loading } = useCaseLogin();

        userService.login.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        login('test@example.com', 'password', null, null);
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
