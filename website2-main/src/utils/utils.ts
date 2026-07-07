function isValidUrl(url: string) {
    const regex = /^https?:\/\/[^\s/]+\.[^\s/]+/;
    return regex.test(url);
}

function openUrl(url: string): void {
    if (!url || !isValidUrl(url)) return
    window.open(url, '_blank');
}

export const downloadFile = async (url: string, filename: string) => {
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
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export {
    isValidUrl,
    openUrl,
};
