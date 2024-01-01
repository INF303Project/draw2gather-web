import type { PageLoad } from './$types';
import type { JoinGameReq } from '$lib/dto';
import { API_URL } from '$lib';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, params, fetch }) => {
    await parent();
    let joined: boolean = false;

    const resp = await fetch(`https://${API_URL}/game`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            game_id: params.game,
        } as JoinGameReq),
        credentials: "include",
    });
    joined = resp.ok;

    if (!joined) {
        throw redirect(301, "/games");
    }
}) satisfies PageLoad;
