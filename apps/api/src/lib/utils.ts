export function extractCloudinaryPublicId(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        const pathname = parsedUrl.pathname;

        // /image/upload/v1787657885/vpetid/pets/abc.jpg
        const uploadIndex = pathname.indexOf('/upload/');

        if (uploadIndex === -1) {
            return null;
        }

        let publicId = pathname.substring(uploadIndex + '/upload/'.length);

        // Remove version: v123456789/
        publicId = publicId.replace(/^v\d+\//, '');

        // Remove extension
        publicId = publicId.replace(/\.[^/.]+$/, '');

        return publicId;
    } catch {
        return null;
    }
}