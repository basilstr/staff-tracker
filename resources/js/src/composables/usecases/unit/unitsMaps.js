export default {
    toServer(data) {
        return data.map(unit => ({
            id: unit.id,
            sort: unit.sort,
            name: unit.name,
        }))
    },
    toClient(data) {
        return data.map(unit => ({
            id: unit.id,
            sort: unit.sort,
            name: unit.name,
            edited: unit.edited,
        }))
    }
}