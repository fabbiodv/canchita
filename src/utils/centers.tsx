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

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/centers`, {
            credentials: 'include',
            cache: 'no-store',
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