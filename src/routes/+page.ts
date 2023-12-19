import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const resp = await fetch("http://localhost:8080/user", {
        credentials: "include",
    });
    const data = await resp.json();

    return {
        user_id: data.user_id,
        name: data.name,
    };
}) satisfies PageLoad;
