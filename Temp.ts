function renderCellValue(value: any): React.ReactNode {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    if (value && typeof value === 'object') {
        return JSON.stringify(value);
    }
    return null;
}