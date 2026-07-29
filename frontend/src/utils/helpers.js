export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return 'http://127.0.0.1:8000' + imagePath;
};
