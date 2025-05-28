import axios from 'axios';
import {beforeEach, describe, expect, test, vi} from 'vitest'
import getConnect from "../../../src/composables/services/getConnect.js";


vi.mock('axios'); // Мокаємо axios

const baseUrl = import.meta.env.VITE_API_BASE_URL;

describe('api.get()', () => {
    test('повертає дані при успішному запиті', async () => {
        const mockData = { message: 'Success' };
        axios.get.mockResolvedValue({ data: mockData });

        const result = await getConnect.get('/test-url', null);

        expect(result).toEqual(mockData);
        expect(axios.get).toHaveBeenCalledWith(baseUrl + '/test-url', { signal: null });
    });

    test('викидає "AuthError" при статусі 401', async () => {
        axios.get.mockRejectedValue({ response: { status: 401 } });

        await expect(getConnect.get('/test-url')).rejects.toThrow('AuthError');
    });

    test('викидає повідомлення про помилку із response.data.error', async () => {
        axios.get.mockRejectedValue({ response: { status: 400, data: { error: 'Invalid request' } } });

        await expect(getConnect.get('/test-url')).rejects.toThrow('Invalid request');
    });

    test('викидає стандартне повідомлення при інших помилках', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        await expect(getConnect.get('/test-url')).rejects.toThrow('Network Error');
    });

    test('передає signal у запит', async () => {
        const mockSignal = new AbortController().signal;
        axios.get.mockResolvedValue({ data: { message: 'Success' } });

        await getConnect.get('/test-url', mockSignal);

        expect(axios.get).toHaveBeenCalledWith(baseUrl + '/test-url', { signal: mockSignal });
    });
});

describe('api.post()', () => {
    test('повертає дані при успішному запиті', async () => {
        const mockData = { message: 'Success' };
        axios.post.mockResolvedValue({ data: mockData });

        const result = await getConnect.post('/test-url', { name: 'John' });

        expect(result).toEqual(mockData);
        expect(axios.post).toHaveBeenCalledWith(baseUrl + '/test-url', { name: 'John' }, { signal: undefined });
    });

    test('викидає "AuthError" при статусі 401', async () => {
        axios.post.mockRejectedValue({ response: { status: 401 } });

        await expect(getConnect.post('/test-url', {})).rejects.toThrow('AuthError');
    });

    test('викидає повідомлення про помилку із response.data.error', async () => {
        axios.post.mockRejectedValue({ response: { status: 400, data: { error: 'Invalid data' } } });

        await expect(getConnect.post('/test-url', {})).rejects.toThrow('Invalid data');
    });

    test('викидає стандартне повідомлення при інших помилках', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'));

        await expect(getConnect.post('/test-url', {})).rejects.toThrow('Network Error');
    });

    test('передає signal у запит', async () => {
        const mockSignal = new AbortController().signal;
        axios.post.mockResolvedValue({ data: { message: 'Success' } });

        await getConnect.post('/test-url', { name: 'John' }, mockSignal);

        expect(axios.post).toHaveBeenCalledWith(baseUrl + '/test-url', { name: 'John' }, { signal: mockSignal });
    });

    describe('api.delete()', () => {
        test('повертає дані при успішному запиті', async () => {
            const mockData = { message: 'Deleted successfully' };
            axios.delete.mockResolvedValue({ data: mockData });

            const result = await getConnect.delete('/test-url');

            expect(result).toEqual(mockData);
            expect(axios.delete).toHaveBeenCalledWith(baseUrl + '/test-url', { signal: undefined });
        });

        test('викидає "AuthError" при статусі 401', async () => {
            axios.delete.mockRejectedValue({ response: { status: 401 } });

            await expect(getConnect.delete('/test-url')).rejects.toThrow('AuthError');
        });

        test('викидає повідомлення про помилку із response.data.error', async () => {
            axios.delete.mockRejectedValue({ response: { status: 400, data: { error: 'Cannot delete' } } });

            await expect(getConnect.delete('/test-url')).rejects.toThrow('Cannot delete');
        });

        test('викидає стандартне повідомлення при інших помилках', async () => {
            axios.delete.mockRejectedValue(new Error('Network Error'));

            await expect(getConnect.delete('/test-url')).rejects.toThrow('Network Error');
        });

        test('передає signal у запит', async () => {
            const mockSignal = new AbortController().signal;
            axios.delete.mockResolvedValue({ data: { message: 'Deleted successfully' } });

            await getConnect.delete('/test-url', mockSignal);

            expect(axios.delete).toHaveBeenCalledWith(baseUrl + '/test-url', { signal: mockSignal });
        });
    });

    describe('api.put()', () => {
        test('повертає дані при успішному запиті', async () => {
            const mockData = { message: 'Updated successfully' };
            axios.put.mockResolvedValue({ data: mockData });

            const result = await getConnect.put('/test-url', { name: 'John' });

            expect(result).toEqual(mockData);
            expect(axios.put).toHaveBeenCalledWith(baseUrl + '/test-url', { name: 'John' }, { signal: undefined });
        });

        test('викидає "AuthError" при статусі 401', async () => {
            axios.put.mockRejectedValue({ response: { status: 401 } });

            await expect(getConnect.put('/test-url', {})).rejects.toThrow('AuthError');
        });

        test('викидає повідомлення про помилку із response.data.error', async () => {
            axios.put.mockRejectedValue({ response: { status: 400, data: { error: 'Invalid update' } } });

            await expect(getConnect.put('/test-url', {})).rejects.toThrow('Invalid update');
        });

        test('викидає стандартне повідомлення при інших помилках', async () => {
            axios.put.mockRejectedValue(new Error('Network Error'));

            await expect(getConnect.put('/test-url', {})).rejects.toThrow('Network Error');
        });

        test('передає signal у запит', async () => {
            const mockSignal = new AbortController().signal;
            axios.put.mockResolvedValue({ data: { message: 'Updated successfully' } });

            await getConnect.put('/test-url', { name: 'John' }, mockSignal);

            expect(axios.put).toHaveBeenCalledWith(baseUrl + '/test-url', { name: 'John' }, { signal: mockSignal });
        });
    });
});
