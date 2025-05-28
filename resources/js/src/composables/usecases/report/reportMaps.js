export default {
    toClient(data) {
        return {
            unit: data.unit ?? null,
            dateFrom: data.date_from ?? null,
            dateTo: data.date_to ?? null,
            reportData: data.report ?? null,
        }
    }
}
