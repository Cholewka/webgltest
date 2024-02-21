export async function getFileContents(path: string): Promise<string | null> {
    const response = await window.fetch("../resources/" + path);
    if (response.ok && response.status == 200) {
        return response.text();
    }
    return null;
}

export const loadImage = async (path: string): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.src = path; 
    });