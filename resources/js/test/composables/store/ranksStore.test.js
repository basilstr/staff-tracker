import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, test} from 'vitest'
import {useRanksStore} from '../../../src/composables/store/ranksStore'

describe('RANK STORE', () =>{
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('set rank not empty data', () => {
        const data = [
            {id: 10, name: 'заборона перегляду статусів'},
            {id: 20, name: 'можливість перегляду статусів'},
            {id: 30, name: 'змінювати тільки власний статус'},
            {id: 40, name: 'змінювати статус персоналу групи'},
            {id: 50, name: 'права адміністратора групи'},
            {id: 60, name: 'права власника групи'},
        ]

        const ranksStore = useRanksStore();
        ranksStore.setRanks(data);

        expect(ranksStore.ranks).toStrictEqual([
            {id: 10, name: 'заборона перегляду статусів'},
            {id: 20, name: 'можливість перегляду статусів'},
            {id: 30, name: 'змінювати тільки власний статус'},
            {id: 40, name: 'змінювати статус персоналу групи'},
            {id: 50, name: 'права адміністратора групи'},
            {id: 60, name: 'права власника групи'},
        ])
    })

    test('set rank empty data', () => {
        const data = []

        const ranksStore = useRanksStore();
        ranksStore.setRanks(data);

        expect(ranksStore.ranks).toStrictEqual([])
    })

    test('check is empty data', () => {
        const data = []

        const ranksStore = useRanksStore();
        ranksStore.setRanks(data);

        expect(ranksStore.isEmptyRanks()).toBe(true)
    })

    test('check is not empty data', () => {
        const data = [
            {id: 10, name: 'заборона перегляду статусів'},
            {id: 20, name: 'можливість перегляду статусів'},
            {id: 30, name: 'змінювати тільки власний статус'},
            {id: 40, name: 'змінювати статус персоналу групи'},
            {id: 50, name: 'права адміністратора групи'},
            {id: 60, name: 'права власника групи'},
        ]

        const ranksStore = useRanksStore();
        ranksStore.setRanks(data);

        expect(ranksStore.isEmptyRanks()).toBe(false)
    })
})