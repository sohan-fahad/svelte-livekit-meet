import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from ".svelte-kit/types/src/routes/$types";
import cookie from "cookie";

export const load: LayoutServerLoad = async ({ request, url, params }) => {
    const cookieHeader = request.headers.get("cookie");
    const cookies = cookie.parse(cookieHeader ?? "");
    const isToken: boolean = cookies[`token`] ? true : false;
    if (!isToken) {
        if (url.pathname.includes('/room')) {
            throw redirect(307, `/?room=${params.roomId}`);
        }
    }

};