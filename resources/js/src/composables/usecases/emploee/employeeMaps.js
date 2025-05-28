export default {
    toServer(data) {
        return {
            id: data.id,
            user_id: data.userId,
            unit_id: data.unitId,
            rank: data.rank,
            name: data.name,
            note: data.note,
            text_color: data.textColor,
            bg_color: data.bgColor,
            sort: data.sort,
            hidden: data.hidden === undefined ? undefined : (data.hidden ? 1 : 0),
        }
    },
    toClient(data) {
        return {
            id: data.id,
            userId: data.user_id,
            unitId: data.unit_id,
            name: data.name,
            rank: data.rank,
            note: data.note,
            textColor: data.text_color,
            bgColor: data.bg_color,
            sort: data.sort,
            hidden: data.hidden === undefined ? undefined : data.hidden === 1,
        }
    },
}
