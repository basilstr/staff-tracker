import { describe, test, expect } from 'vitest';
import {inviteFormatter} from "../../../../src/composables/usecases/emploee/inviteMaps";
import inviteMaps from "../../../../src/composables/usecases/emploee/inviteMaps";

describe('inviteFormatter', () => {
    test('перевірка форматування інвайту коли він встановлений', () => {
        const invite = '123321'

        expect(inviteFormatter(invite)).toEqual('http://test.site/login/' + invite);
    })
});

describe('transform.toServer()', () => {
    test('перетворює масив обʼєктів для сервера', () => {
        const input = {
            invite: "12344321",
            expired_at: "2025-12-12",
        };

        const expectedOutput = {
            invite: 'http://test.site/login/12344321',
            expiredAt: "2025-12-12"
        };

        expect(inviteMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(inviteMaps.toClient({})).toEqual({});
    });
});
