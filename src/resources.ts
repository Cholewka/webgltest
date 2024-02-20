export async function getFileContents(path: string): Promise<string | null> {
    const response = await window.fetch("../resources/" + path);
    if (response.ok && response.status == 200) {
        return response.text();
    }
    return null;
}