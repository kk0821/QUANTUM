
const formatDate = (dateString: string, time: boolean = false, short: boolean = false) => {
    if (dateString) {
        const date = new Date(dateString);
        const options = {
            weekday: short ? 'short' : 'long',
            year: 'numeric',
            month: short ? '2-digit' : 'long',
            day: '2-digit',
            ...( time ? {hour: '2-digit', minute: '2-digit', second: '2-digit'} : {})
        };
        // @ts-ignore
        return new Intl.DateTimeFormat('default', options).format(date);
    } else {
        return;
    }
}

export { formatDate }
