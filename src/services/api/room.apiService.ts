export const RoomApiService = {
    getToken: async (roomName: string, participantName: string) => {
        const response = await fetch('/api/token', {
            method: 'POST',
            body: JSON.stringify({ roomName, participantName }),
            headers: {
                'content-type': 'application/json'
            }
        });

        return await response.json();
    }
}