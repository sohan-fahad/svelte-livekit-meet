import type { LayoutServerLoad } from ".svelte-kit/types/src/routes/$types";
import cookie from "cookie";

export const load: LayoutServerLoad = async ({ request }) => {

    const cookieHeader = request.headers.get("cookie");
    const cookies = cookie.parse(cookieHeader ?? "");
    const token = cookies[`token`];


    return {
        token
    }
};