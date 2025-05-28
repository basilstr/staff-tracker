import {describe, test, expect} from 'vitest';
import statusesMaps from "../../../../src/composables/usecases/status/statusesMaps";

describe('transform.toServer()', () => {
    test('перетворює масив обʼєктів для сервера', () => {
        const input = [
            {
                id: 1,
                sort: 10,
                fullName: 'Unit A',
                shortName: 'A',
                group: true,
                textColor: "#000000",
                bgColor: "#ffffff",
                deletedAt: '2025-12-12'
            },
            {
                id: 2,
                sort: 20,
                fullName: 'Unit B',
                shortName: 'B',
                group: true,
                textColor: "#000000",
                bgColor: "#ffffff",
                deletedAt: '2025-12-12'
            }
        ];

        const expectedOutput = [
            {
                id: 1,
                sort: 10,
                name: 'Unit A',
                short_name: 'A',
                is_group: true,
                text_color: "#000000",
                bg_color: "#ffffff",
                deleted_at: '2025-12-12'
            },
            {
                id: 2,
                sort: 20,
                name: 'Unit B',
                short_name: 'B',
                is_group: true,
                text_color: "#000000",
                bg_color: "#ffffff",
                deleted_at: '2025-12-12'
            }
        ];

        expect(statusesMaps.toServer(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(statusesMaps.toServer([])).toEqual([]);
    });
});

describe('transform.toClient()', () => {
    test('перетворює масив обʼєктів для клієнта', () => {
        const input = [
            {
                id: 1,
                sort: 10,
                name: 'Unit A',
                short_name: 'A',
                is_group: true,
                text_color: "#000000",
                bg_color: "#ffffff",
                deleted_at: '2025-12-12'
            },
            {
                id: 2,
                sort: 20,
                name: 'Unit B',
                short_name: 'B',
                is_group: true,
                text_color: "#000000",
                bg_color: "#ffffff",
                deleted_at: '2025-12-12'
            }
        ];

        const expectedOutput = [
            {
                id: 1,
                sort: 10,
                fullName: 'Unit A',
                shortName: 'A',
                group: true,
                textColor: "#000000",
                bgColor: "#ffffff",
                deletedAt: '2025-12-12'
            },
            {
                id: 2,
                sort: 20,
                fullName: 'Unit B',
                shortName: 'B',
                group: true,
                textColor: "#000000",
                bgColor: "#ffffff",
                deletedAt: '2025-12-12'
            }
        ];

        expect(statusesMaps.toClient(input)).toEqual(expectedOutput);
    });

    test('повертає порожній масив при пустому вхідному масиві', () => {
        expect(statusesMaps.toClient([])).toEqual([]);
    });
});
