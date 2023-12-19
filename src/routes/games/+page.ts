import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const resp = await fetch("http://localhost:8080/games");
    const data = await resp.json();
    return {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        games: data.games,
    };
}) satisfies PageLoad;
