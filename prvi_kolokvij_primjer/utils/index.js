export function dateDiffInDays(start, end) {
    const d1 = new Date(start);
    const d2 = new Date(end);

    const diffMs = d2 - d1;
    return diffMs / (1000 * 60 * 60 * 24);
}

export function normalize(str) {
    return str.toLowerCase().trim();
}
