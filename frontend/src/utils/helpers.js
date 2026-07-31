// export const getImageUrl = (imagePath) => {
//     if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
//     if (imagePath.startsWith('http')) return imagePath;
//     return 'http://127.0.0.1:8000' + imagePath;
// };

export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '') 
        : 'http://127.0.0.1:8000';
    return baseUrl + imagePath;
};