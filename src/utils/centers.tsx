import { Center } from "@/types/center"

export const fetchUserCenters = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/centers/user/centers`,
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

export const createCenter = async (center: Center) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers`, {
            method: 'POST',
            body: JSON.stringify(center),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Error al crear centro deportivo');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export async function fetchAllCenters() {
    // Durante el build, retornar array vacío
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return [];
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('API URL no configurada');
        return [];
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers`, {
            credentials: 'include',
            next: { revalidate: 3600 },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener centros:', error);
        return [];
    }
}