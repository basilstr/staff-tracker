export default {
    toServer(data) {
        return data.map(status => ({
            id: status.id,
            sort: status.sort,
            name: status.fullName,
            short_name: status.shortName,
            is_group: status.group,
            text_color: status.textColor,
            bg_color: status.bgColor,
            deleted_at: status.deletedAt,
        }))
    },
    toClient(data) {
        return data.map(status => ({
                id: status.id,
                sort: status.sort,
                fullName: status.name,
                shortName: status.short_name,
                group: status.is_group,
                textColor: status.text_color,
                bgColor: status.bg_color,
                deletedAt: status.deleted_at,
        }))
    }
}