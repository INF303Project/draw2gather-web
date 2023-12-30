import type { PageLoad } from './$types';
import type { GetGameResp, GetWordSetsResp } from '$lib/dto';
import { API_URL } from '$lib';

export const load = (async ({ parent, fetch }) => {
    const data = await parent();

    let resp = await fetch(`http://${API_URL}:8080/games`, {
        credentials: "include",
    });
    const games = await resp.json() as GetGameResp;

    let word_sets: GetWordSetsResp | undefined;
    if (data.user.user_id) {
        resp = await fetch(`http://${API_URL}:8080/set`, {
            credentials: "include",
        });
        word_sets = await resp.json() as GetWordSetsResp;
    }

    return {
        games,
        word_sets,
    };
}) satisfies PageLoad;
