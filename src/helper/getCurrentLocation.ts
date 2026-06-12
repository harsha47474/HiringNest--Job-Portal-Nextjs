export const getCurrentLocation = (): Promise<{
    status: string;
    message: string;
    city?: string;
    state?: string;
    formattedLocation?: string;
    latitude?: number;
    longitude?: number;
}> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({
                status: "error",
                message: "Geo location not supported",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_OPENSTREETMAP_API}?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        "";

                    const state = data.address.state || "";

                    const formattedLocation = `${city}, ${state}`;

                    resolve({
                        city,
                        state,
                        formattedLocation,
                        latitude,
                        longitude,
                        status: "Success",
                        message: "Fetched successfully",
                    });
                } catch {
                    resolve({
                        status: "error",
                        message: "Failed to fetch location",
                    });
                }
            },
            () => {
                resolve({
                    status: "error",
                    message: "Failed to fetch location",
                });
            }
        );
    });
};