import {describe, it, expect, vi, beforeEach, test} from 'vitest';
import {useCaseSendInvite} from "../../../../src/composables/usecases/user/useCaseSendInvite";
import userService from "../../../../src/composables/services/userService";
import employeeService from "../../../../src/composables/services/employeeService";

vi.mock('../../../../src/composables/services/userService', () => ({
    default: {
        sendInvite: vi.fn()
    }
}));

describe('useCaseSendInvite', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('початкові значення змінних ref()', () => {
        const {message, loading, error, authError} = useCaseSendInvite();

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(authError.value).toBe(false);
        expect(message.value).toBe('');
    });

    test('отримує дані передає на сервер ', async () => {
        const {message, sendInvite, loading, error} = useCaseSendInvite();

        const mockData = { message: "message" }
        userService.sendInvite.mockResolvedValue(mockData);

        await sendInvite('invite');

        expect(loading.value).toBe(false);
        expect(error.value).toBe(null);
        expect(message.value).toBe('message');
    });

    test('якщо сервер повертає помилку авторизації, встановлює authError', async () => {
        const {sendInvite, authError} = useCaseSendInvite();

        userService.sendInvite.mockRejectedValue(new Error('AuthError'));

        await sendInvite('invite');

        expect(authError.value).toBe(true);
    });


    test('якщо сервер повертає іншу помилку, зберігає її у error', async () => {
        const {sendInvite, error} = useCaseSendInvite();

        userService.sendInvite.mockRejectedValue(new Error('Server Error'));

        await sendInvite('invite');

        expect(error.value).toBe('Server Error');
    });

    test('скасовує запит через AbortController', async () => {
        const {cancelRequest, sendInvite, loading} = useCaseSendInvite();

        userService.sendInvite.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );

        sendInvite('invite');

        cancelRequest();

        expect(loading.value).toBe(false);
    });

    test('спроба скасувати запит через AbortController коли він завершений', async () => {
        const {sendInvite, cancelRequest, loading} = useCaseSendInvite();

        userService.sendInvite.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('canceled')), 100))
        );
        await sendInvite('invite');
        loading.value = false
        cancelRequest();
        expect(loading.value).toBe(false);
    });
});
