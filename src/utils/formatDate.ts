export const formatDateForApi = (date: string) => {
    const [year, month, day] = date.split('-')
    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
}