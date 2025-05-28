export default {
    toClient(data) {
        return data.map(employee => ({
            id: employee.id,
            userId: employee.user_id,
            unitId: employee.unit_id,
            name: employee.name,
            rank: employee.rank,
            note: employee.note,
            textColor: employee.text_color,
            bgColor: employee.bg_color,
            sort: employee.sort,
            hidden: employee.hidden === 1,
        }))
    }
}
