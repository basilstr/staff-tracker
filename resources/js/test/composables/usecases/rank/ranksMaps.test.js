import { describe, test, expect } from 'vitest';
import ranksMaps from "../../../../src/composables/usecases/rank/ranksMaps.js";

describe('transform.toClient()', () => {
    test('перетворює масив обʼєктів для клієнта', () => {
        const input = [
            { id: 1, name: 'name A' },
            { id: 2, name: 'name B' }
        ];

        const expectedOutput = [
            { id: 1, name: 'name A' },
            { id: 2, name: 'name B' }
        ];

        expect(ranksMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(ranksMaps.toClient([])).toEqual([]);
    });
});
