export function formatDate(date: string): string {
    const months = [
        'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
        'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.',
    ];
    const [year, month, day] = date.split('-').map(Number);

    // guards against invalid input since split/Number gives no runtime type safety
    if (!year || !month || !day || month < 1 || month > 12) {
        throw new Error(`Invalid date format, expected AAAA-MM-DD: ${date}`);
    }

    return `${day} de ${months[month - 1]} de ${year}`;
}