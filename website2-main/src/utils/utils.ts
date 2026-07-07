function isValidUrl(url: string): boolean {
    return /^https?:\/\/[^\s/]+\.[^\s/]+/.test(url);
}

export function openUrl(url: string): void {
    if (!url || !isValidUrl(url)) return;
    window.open(url, '_blank');
}

export async function downloadFile(url: string, filename: string): Promise<void> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Download failed');
    }
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
