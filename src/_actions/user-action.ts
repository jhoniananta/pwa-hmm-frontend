'use server';

import {env} from '@/env';
import {actionClient} from '@/lib/action-client';
import {handleError, PWAError} from '@/lib/error';
import {editProfileSchema, signInSchema, signUpSchema,} from '@/lib/schema';
import {createSession, deleteSession, verifySession} from '@/lib/session';
import {getTokenFromResponse} from '@/lib/utils';
import {flattenValidationErrors} from 'next-safe-action';
import {$AuthenticationAPI as authAPI, $AuthenticationAPI, $UserAPI as userAPI} from "lms-types";
import {z} from 'zod';
import getVerboseStatus from "@/lib/getVerboseStatus";
import {fetchAction} from "@/lib/fetch";

export type PublicUserResponse = {
    userId: number;
    avatar: string;
    email: string;
    name: string;
}

export const getPublicUsers = async () =>
    await fetchAction<PublicUserResponse[]>(
        `/users/public`,
        'Failed to fetch public users',
        {
            tags: ['public-users'],
            name: 'getPublicUsers',
            cache: 'no-cache'
        }
    )();

export const signUp = actionClient
    .metadata({actionName: 'signUp'})
    .schema(signUpSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {avatar, medicalHistories, UKM, hobbies, confirmPassword, dateOfBirth, ...rest}}) => {
        const res = await fetchAction<PublicUserResponse>(
            `/users`,
            'Failed to create user',
            {
                method: 'POST',
                bodyObject: {
                    ...rest,
                    dateOfBirth: new Date(dateOfBirth),
                    medicalHistories: medicalHistories ?? [],
                    hobbies: hobbies ?? [],
                    enrolledStudentUnits: UKM ?? []
                },
            }
        )();
        return res;
    });

export const signIn = actionClient
    .metadata({actionName: 'signIn'})
    .schema(signInSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {email, password}}) => {
        try {
            const isVerbose = getVerboseStatus()

            const res = await fetch(env.API_URL + authAPI.SignIn.generateUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                } as $AuthenticationAPI.SignIn.Dto),
            });


            const {access_token, refresh_token, expire} = getTokenFromResponse(
                res
            );

            // ToDo: Recheck. No need to call? since there's no return body
            // const signInRes = await res.json();
            // if (signInRes.error) {
            //     throw new PWAError(signInRes.error.message);
            // }

            const data = await fetch(env.API_URL + userAPI.GetMe.generateUrl(), {
                headers: {
                    Cookie: `accessToken=${access_token}; refreshToken=${refresh_token}`,
                },
            });

            const dataRt = await data.json();

            if (dataRt.error) {
                throw new PWAError(dataRt.error.message);
            }

            if (!res.ok || !access_token || !refresh_token) {
                throw new PWAError('Failed to retrieve tokens');
            }

            const {userId, role} = dataRt.data;

            void createSession(userId, role, access_token, refresh_token, expire ?? '0');

            return {
                message: 'User signed in successfully',
                status: 'success',
                redirect: true,
            };
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }

            throw new PWAError('Failed to sign in');
        }
    });

export async function signOut() {
    try {
        const session = await verifySession();

        if (!session.isAuth) {
            return {
                status: 'unauthenticated',
            };
        }

        await fetch(env.API_URL + authAPI.SignOut.generateUrl(), {
            method: 'POST',
            credentials: 'include',
            headers: {
                Cookie: `accessToken=${session.access_token}`,
            },
        });

        void deleteSession();

        return {
            status: 'success',
        };
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }

        throw new PWAError('Failed to sign out');
    }
}

export const editProfile = actionClient
    .metadata({actionName: 'editProfile'})
    .schema(editProfileSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {dateOfBirth, email, ...input}}) => {
        try {
            const session = await verifySession();

            if (!session.isAuth) {
                throw new PWAError('Unauthorized');
            }

            const bodyInput: userAPI.UpdateUserProfile.Dto = {
                dateOfBirth: new Date(dateOfBirth),
                // email,
                ...input,
            };

            const res = await fetch(env.API_URL + userAPI.UpdateUserProfile.generateUrl(), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `accessToken=${session.access_token}`,
                },
                body: JSON.stringify(bodyInput),
            });

            if (!res.ok) {
                handleError(res);
            }

            return {
                message: 'Profile updated successfully',
                status: 'success',
            };
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to update profile');
        }
    });


// Add this with the other actions
export const updateAvatar = actionClient
    .metadata({actionName: 'updateAvatar'})
    .schema(z.object({avatar: z.string()}), {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({parsedInput: {avatar}}) => {
        try {
            const session = await verifySession();

            if (!session.isAuth) {
                throw new PWAError('Unauthorized');
            }

            const res = await fetch(
                env.API_URL + userAPI.UpdateUserProfile.generateUrl(),
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: `accessToken=${session.access_token}`,
                    },
                    body: JSON.stringify({avatar}),
                }
            );

            if (!res.ok) {
                handleError(res);
            }

            return {
                message: 'Avatar updated successfully',
                status: 'success',
            };
        } catch (err) {
            if (err instanceof Error) {
                throw new PWAError(err.message);
            }
            throw new PWAError('Failed to update avatar');
        }
    });