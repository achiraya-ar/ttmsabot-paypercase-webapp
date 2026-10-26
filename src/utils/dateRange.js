export function toISODate(date = new Date()) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function parseISODate(value) {
    if (!value) return null;
    const [year, month, day] = String(value).split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

export function todayISO() {
    return toISODate(new Date());
}

export function startOfMonthISO(date = new Date()) {
    const d = new Date(date);
    return toISODate(new Date(d.getFullYear(), d.getMonth(), 1));
}
