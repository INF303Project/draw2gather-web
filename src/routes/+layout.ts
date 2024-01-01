export const ssr = false;
export const prerender = false;

import type { LayoutLoad } from './$types';
import type { GetUserResp } from '$lib/dto';
import { API_URL } from '$lib';

export const load = (async ({ fetch }) => {
    const resp = await fetch(`https://${API_URL}/user`, {
        credentials: "include",
    });
    const user = await resp.json() as GetUserResp;

    return {
        user
    };
}) satisfies LayoutLoad;
