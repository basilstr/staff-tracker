import { describe, test, expect } from 'vitest';
import unitsMaps from "../../../../src/composables/usecases/unit/unitsMaps.js";

describe('transform.toServer()', () => {
    test('перетворює масив обʼєктів для сервера', () => {
        const input = [
            { id: 1, sort: 10, name: 'Unit A', edited: true, extra: 'remove' },
            { id: 2, sort: 20, name: 'Unit B', edited: false, extra: 'remove' }
        ];

        const expectedOutput = [
            { id: 1, sort: 10, name: 'Unit A' },
            { id: 2, sort: 20, name: 'Unit B' }
        ];

        expect(unitsMaps.toServer(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(unitsMaps.toServer([])).toEqual([]);
    });
});

describe('transform.toClient()', () => {
    test('перетворює масив обʼєктів для клієнта', () => {
        const input = [
            { id: 1, sort: 10, name: 'Unit A', edited: true },
            { id: 2, sort: 20, name: 'Unit B', edited: false }
        ];

        const expectedOutput = [
            { id: 1, sort: 10, name: 'Unit A', edited: true },
            { id: 2, sort: 20, name: 'Unit B', edited: false }
        ];

        expect(unitsMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('якщо вхідні обʼєкти не містять "edited", значення має залишатися undefined', () => {
        const input = [
            { id: 1, sort: 10, name: 'Unit A' },
            { id: 2, sort: 20, name: 'Unit B' }
        ];

        const expectedOutput = [
            { id: 1, sort: 10, name: 'Unit A', edited: undefined },
            { id: 2, sort: 20, name: 'Unit B', edited: undefined }
        ];

        expect(unitsMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(unitsMaps.toClient([])).toEqual([]);
    });
});
