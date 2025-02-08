export const fetchUserCenters = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/centers/user/centers`,
            {
                credentials: 'include'
            }
        );

        if (!response.ok) {
            throw new Error('Error al obtener centros deportivos');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};