import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const resp = await fetch("http://192.168.0.10:8080/games", {
        credentials: "include",
    });
    const data = await resp.json();
    return {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        games: data.games,
    };
}) satisfies PageLoad;
