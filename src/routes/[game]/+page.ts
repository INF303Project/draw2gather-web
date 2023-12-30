import type { PageLoad } from './$types';
import type { JoinGameReq } from '$lib/dto';
import { API_URL } from '$lib';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, params, fetch }) => {
    await parent();

    let joined: boolean = false;

    try {
        const resp = await fetch(`http://${API_URL}:8080/game`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                game_id: params.game,
            } as JoinGameReq),
            credentials: "include",
        });
        if (resp.ok) {
            joined = true;
        }
    } catch (error) {
        console.error(error);
    }

    if (!joined) {
        throw redirect(301, "/games");
    }
}) satisfies PageLoad;
