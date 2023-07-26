import { ENV } from '$src/ENV.js';
import { json } from '@sveltejs/kit';
// import jwt from 'jsonwebtoken'
// import * as jose from 'jose'
import { AccessToken } from 'livekit-server-sdk';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { roomName, participantName } = await request.json();

        const identity = participantName.split(" ")[0] + "_" + Date.now() + "_" + roomName
        const at = new AccessToken(ENV.LIVEKIT_PUBLIC_KEY, ENV.LIVEKIT_SECRET_KEY, {
            identity: identity,
            name: participantName
        });

        at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

        const token = at.toJwt();

        const response = {
            message: "Successfull",
            statusCode: 200,
            payload: { token },
            success: true
        }

        console.log(response);

        return json(response, { status: 200 });
    } catch (error) {
        json(error, { status: 400 });
    }
}