import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, test} from 'vitest'
import {useStatusesStore} from '../../../src/composables/store/statusesStore'

describe('STATUS STORE', () =>{
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('set empty data on nullable store', () => {
        const statusesStore = useStatusesStore();

        const data = []
        statusesStore.setStatuses(null, data);

        expect(statusesStore.statuses).toStrictEqual([])

        expect(statusesStore.unit).toBe(null)
    })

    test('set data and null unit on nullable store', () => {
        const data = [
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ]

        const statusesStore = useStatusesStore();
        statusesStore.setStatuses(null, data);

        expect(statusesStore.statuses).toStrictEqual([
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ])

        expect(statusesStore.unit).toBe(null)
    })


    test('set data and not null on nullable store', () => {
        const data = [
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ]

        const statusesStore = useStatusesStore();
        statusesStore.setStatuses(2, data);

        expect(statusesStore.statuses).toStrictEqual([
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ])

        expect(statusesStore.unit).toBe(2)
    })

    test('check clear statuses', () => {
        const statusesStore = useStatusesStore();

        statusesStore.unit = 3
        statusesStore.statuses = [
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ]

        statusesStore.clearStatuses()

        expect(statusesStore.statuses).toStrictEqual([])
        expect(statusesStore.unit).toBe(null)
    })

    test('is empty statuses on non empty data and unit is equal unit statuses', () => {
        const statusesStore = useStatusesStore();

        statusesStore.unit = 3
        statusesStore.statuses = [
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ]

        expect(statusesStore.isEmptyStatuses(3)).toBe(false)
    })

    test('is empty statuses on non empty data and unit is not equal unit statuses', () => {
        const statusesStore = useStatusesStore();

        statusesStore.unit = 2
        statusesStore.statuses = [
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ]

        expect(statusesStore.isEmptyStatuses(3)).toBe(true)
    })

    test('is empty statuses on non empty statuses and unit is null', () => {
        const statusesStore = useStatusesStore();

        statusesStore.unit = null
        statusesStore.statuses = [
            {
                id: 1,
                sort: 2,
                name: "В наявності",
                short_name: "+",
                is_group: true,
                text_color: "#000000",
                bg_color: "#ccff99",
                deleted_at: null
            },
            {id: 5, sort: 3, name: "Наряд", short_name: "Н", is_group: false, text_color: "#000000", bg_color: "#ffcccc", deleted_at: null},
            {id: 4, sort: 5, name: "Хворий", short_name: "хв", is_group: false, text_color: "#000000", bg_color: "#ff99ff", deleted_at: null},
            {
                id: 6,
                sort: 3,
                name: "Відрядження",
                short_name: "вдр",
                is_group: false,
                text_color: "#000000",
                bg_color: "#d5a6ff",
                deleted_at: null
            },
            {id: 3, sort: 8, name: "Вихідний", short_name: "вхд", is_group: true, text_color: "#000000", bg_color: "#ffff99", deleted_at: null},
            {id: 2, sort: 4, name: "ВИДАЛЕНИЙ", short_name: "вхд", is_group: false, text_color: "#000000", bg_color: "#ffff99", deleted_at: '2025-02-22 12:12:12'},
        ]

        expect(statusesStore.isEmptyStatuses()).toBe(true)
    })

    test('is empty statuses on empty statuses and unit is not null', () => {
        const statusesStore = useStatusesStore();

        statusesStore.unit = 3
        statusesStore.statuses = []

        expect(statusesStore.isEmptyStatuses()).toBe(true)
    })

    test('is empty statuses on empty statuses and unit is null', () => {
        const statusesStore = useStatusesStore();

        statusesStore.unit = null
        statusesStore.statuses = []

        expect(statusesStore.isEmptyStatuses()).toBe(true)
    })
})