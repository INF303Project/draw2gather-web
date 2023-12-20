import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    let joined: boolean = false;

    try {
        const resp = await fetch("http://192.168.0.10:8080/game", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                game_id: params.game,
            }),
            credentials: "include",
        });
        if (resp.ok) {
            joined = true;
        }
    } catch (error) {
        console.error(error);
        joined = false;
    }

    if (!joined) {
        console.log("redirecting");
        throw redirect(301, "/games");
    }
}) satisfies PageLoad;
