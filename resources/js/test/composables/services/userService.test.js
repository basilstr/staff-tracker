import {describe, test, expect, vi, beforeEach} from 'vitest';
import getConnect from "../../../src/composables/services/getConnect";
import {
    API_URL_POST_LOGIN,
    API_URL_PUT_USER,
    API_URL_DELETE_USER,
    API_URL_GET_INVITE,
    API_URL_POST_JOIN
} from '../../../src/composables/services/userService'; // Імпорт API URL
import userService from "../../../src/composables/services/userService";

vi.mock('../../../src/composables/services/getConnect', () => ({
    default: {
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    }
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe('login', () => {
    test('should login successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const data = {login: 'login', password: 'password'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await userService.login(data, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_LOGIN(), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const data = {login: 'login', password: 'password'};
        const signal = {};

        await expect(userService.login(data, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_LOGIN(), data, signal);
    });
});

describe('saveUser', () => {
    test('should save user successfully', async () => {
        const mockResponse = {id: 1, name: 'John Doe'};
        getConnect.put.mockResolvedValue(mockResponse);

        const data = {id: 1, name: 'John Doe'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await userService.saveUser(data, signal);

        expect(getConnect.put).toHaveBeenCalledWith(API_URL_PUT_USER(), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.put.mockRejectedValue(new Error('Network error'));

        const data = {id: 1, name: 'John Doe'};
        const signal = {};

        await expect(userService.saveUser(data, signal)).rejects.toThrow('Network error');
        expect(getConnect.put).toHaveBeenCalledWith(API_URL_PUT_USER(), data, signal);
    });
});

describe('deleteUser', () => {
    test('should delete user successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.delete.mockResolvedValue(mockResponse);

        const signal = {}; // Можна передати реальний AbortSignal

        const result = await userService.deleteUser(signal);

        expect(getConnect.delete).toHaveBeenCalledWith(API_URL_DELETE_USER(), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.delete.mockRejectedValue(new Error('Network error'));

        const signal = {};

        await expect(userService.deleteUser(signal)).rejects.toThrow('Network error');
        expect(getConnect.delete).toHaveBeenCalledWith(API_URL_DELETE_USER(), signal);
    });
});

describe('getInvite', () => {
    test('should get invite successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.get.mockResolvedValue(mockResponse);

        const signal = {}; // Можна передати реальний AbortSignal

        const result = await userService.getInvite(signal);

        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_INVITE(), signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.get.mockRejectedValue(new Error('Network error'));

        const signal = {};

        await expect(userService.getInvite(signal)).rejects.toThrow('Network error');
        expect(getConnect.get).toHaveBeenCalledWith(API_URL_GET_INVITE(), signal);
    });
});

describe('sendInvite', () => {
    test('should send invite successfully', async () => {
        const mockResponse = {data: [{id: 1, name: 'John Doe'}]};
        getConnect.post.mockResolvedValue(mockResponse);

        const data = {invite: 'invite'};
        const signal = {}; // Можна передати реальний AbortSignal

        const result = await userService.sendInvite(data, signal);

        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_JOIN(), data, signal);
        expect(result).toEqual(mockResponse);
    });

    test('should handle API errors', async () => {
        getConnect.post.mockRejectedValue(new Error('Network error'));

        const data = {invite: 'invite'};
        const signal = {};

        await expect(userService.sendInvite(data, signal)).rejects.toThrow('Network error');
        expect(getConnect.post).toHaveBeenCalledWith(API_URL_POST_JOIN(), data, signal);
    });
});
