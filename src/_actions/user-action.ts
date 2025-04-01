'use server';

import {env} from '@/env';
import {actionClient} from '@/lib/action-client';
import {handleError, PWAError} from '@/lib/error';
import {
  signInSchema,
  signUpSchema,
  editProfileSchema,
  updateEmailSchema,
  updatePasswordSchema,
  updateRoleSchema,
  deleteUserSchema,
} from '@/lib/schema';
import {createSession, deleteSession, verifySession} from '@/lib/session';
import {getTokenFromResponse} from '@/lib/utils';
import {flattenValidationErrors} from 'next-safe-action';
import {$UserAPI as userAPI, $AuthenticationAPI as authAPI} from "lms-types";
import { fetchAction } from '@/lib/fetch';
import {z} from 'zod';

export const signUp = actionClient
  .metadata({actionName: 'signUp'})
  .schema(signUpSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({parsedInput: {confirmPassword, dateOfBirth, email, ...input}}) => {
    try {
      const bodyInput: userAPI.CreateUser.Dto = {
        dateOfBirth: new Date(dateOfBirth),
        NIM: email.split('@')[0],
        email,
        ...input,
      }
      const res = await fetch(env.API_URL + userAPI.CreateUser.generateUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyInput),
      });

      if (!res.ok) {
        throw new PWAError('Failed to sign up');
      }

      return {
        message: 'User created successfully',
        status: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }

      throw new PWAError('Failed to sign up');
    }
  });

export const signIn = actionClient
  .metadata({actionName: 'signIn'})
  .schema(signInSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({parsedInput: {email, password}}) => {
    try {
      const res = await fetch(env.API_URL + authAPI.SignIn.generateUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        } as userAPI.SignIn.Dto),
      });

      const {access_token, refresh_token, expire} = getTokenFromResponse(
        res
      );

      const signInRes = await res.json();

      if (signInRes.error) {
        throw new PWAError(signInRes.error.message);
      }

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

      const {id, role} = dataRt.data;

      void createSession(id, role, access_token, refresh_token, expire ?? '0');
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
  .metadata({ actionName: 'editProfile' })
  .schema(editProfileSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { dateOfBirth, email, ...input } }) => {
    try {
      const session = await verifySession();
      
      if (!session.isAuth) {
        throw new PWAError('Unauthorized');
      }

      const bodyInput: userAPI.UpdateBasicUser.Dto = {
        dateOfBirth: new Date(dateOfBirth),
        email,
        ...input,
      };

      const res = await fetch(env.API_URL + userAPI.UpdateBasicUser.generateUrl(session.userId), {
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

  // Get all public users
export const getPublicUsers = fetchAction<userAPI.GetPublicUsers.Response['data']>(
  userAPI.GetPublicUsers.generateUrl(),
  'Failed to fetch public users',
  { tags: ['users'] }
);

// Get user by ID
export const getUserById = async (userId: string) =>
  await fetchAction<userAPI.GetUserById.Response['data']>(
    userAPI.GetUserById.generateUrl(userId),
    'Failed to fetch user',
    { tags: ['users', `user-${userId}`] }
  )();

// Get current user
export const getMe = fetchAction<userAPI.GetMe.Response['data']>(
  userAPI.GetMe.generateUrl(),
  'Failed to fetch current user',
  { tags: ['me'] }
);

// Get user permissions
export const getUserPermissions = async (userId: string) =>
  await fetchAction<userAPI.GetUserPermissions.Response['data']>(
    userAPI.GetUserPermissions.generateUrl(userId),
    'Failed to fetch user permissions'
  )();

// Get user report
export const getUserReport = async (userId: string) =>
  await fetchAction<userAPI.GetUserReport.Response['data']>(
    userAPI.GetUserReport.generateUrl(userId),
    'Failed to fetch user report'
  )();

// Get user orders
export const getUserOrders = async (userId: string) =>
  await fetchAction<userAPI.GetUserOrders.Response['data']>(
    userAPI.GetUserOrders.generateUrl(userId),
    'Failed to fetch user orders'
  )();

// Get department programs with enrollment info
export const getDepartmentProgramsWithEnrollment = async (userId: string, departmentId: number) =>
  await fetchAction<userAPI.GetDepartmentProgramsWithEnrollmentInformation.Response['data']>(
    userAPI.GetDepartmentProgramsWithEnrollmentInformation.generateUrl(userId, departmentId),
    'Failed to fetch department programs'
  )();


// Update user email
export const updateEmail = actionClient
  .metadata({ actionName: 'updateEmail' })
  .schema(updateEmailSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email } }) => {
    try {
      const session = await verifySession();
      
      if (!session.isAuth) {
        throw new PWAError('Unauthorized');
      }

      const res = await fetch(
        env.API_URL + userAPI.UpdateUserEmail.generateUrl(session.userId),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `accessToken=${session.access_token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        handleError(res);
      }

      return {
        message: 'Email updated successfully',
        status: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update email');
    }
  });

// Update user password
export const updatePassword = actionClient
  .metadata({ actionName: 'updatePassword' })
  .schema(updatePasswordSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { password } }) => {
    try {
      const session = await verifySession();
      
      if (!session.isAuth) {
        throw new PWAError('Unauthorized');
      }

      const res = await fetch(
        env.API_URL + userAPI.UpdateUserPassword.generateUrl(session.userId),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `accessToken=${session.access_token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!res.ok) {
        handleError(res);
      }

      return {
        message: 'Password updated successfully',
        status: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update password');
    }
  });

// Update user role
export const updateRole = actionClient
  .metadata({ actionName: 'updateRole' })
  .schema(updateRoleSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { userId, role } }) => {
    try {
      const session = await verifySession();
      
      if (!session.isAuth) {
        throw new PWAError('Unauthorized');
      }

      const res = await fetch(
        env.API_URL + userAPI.UpdateUserRole.generateUrl(userId),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `accessToken=${session.access_token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!res.ok) {
        handleError(res);
      }

      return {
        message: 'Role updated successfully',
        status: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to update role');
    }
  });

// Delete user
export const deleteUser = actionClient
  .metadata({ actionName: 'deleteUser' })
  .schema(deleteUserSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { userId } }) => {
    try {
      const session = await verifySession();
      
      if (!session.isAuth) {
        throw new PWAError('Unauthorized');
      }

      const res = await fetch(
        env.API_URL + userAPI.DeleteUser.generateUrl(userId),
        {
          method: 'DELETE',
          headers: {
            Cookie: `accessToken=${session.access_token}`,
          },
        }
      );

      if (!res.ok) {
        handleError(res);
      }

      return {
        message: 'User deleted successfully',
        status: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new PWAError(err.message);
      }
      throw new PWAError('Failed to delete user');
    }
  });

// Add this with the other actions
export const updateAvatar = actionClient
  .metadata({ actionName: 'updateAvatar' })
  .schema(z.object({ avatar: z.string() }), {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { avatar } }) => {
    try {
      const session = await verifySession();
      
      if (!session.isAuth) {
        throw new PWAError('Unauthorized');
      }

      const res = await fetch(
        env.API_URL + userAPI.UpdateBasicUser.generateUrl(session.userId),
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `accessToken=${session.access_token}`,
          },
          body: JSON.stringify({ avatar }),
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