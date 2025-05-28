export default {
    toClient(data) {
        return data.map(rank => ({
            id: rank.id,
            name: rank.name,
        }))
    }
}