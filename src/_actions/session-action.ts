'use server'

import {verifySession} from "@/lib/session";

export const getUserId = async () => {
    const session = await verifySession()
    return Number(session?.userId)
}