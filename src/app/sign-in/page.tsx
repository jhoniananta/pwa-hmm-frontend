'use client';

import {signIn} from '@/_actions/user-action';
import Button from '@/components/ui/button/button';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import {type BaseSyntheticEvent, useState} from 'react';
import {useForm} from 'react-hook-form';
import {FiEye, FiEyeOff} from 'react-icons/fi';
import {z} from 'zod';
import {useAction} from 'next-safe-action/hooks';
import {toast} from 'sonner';
import {signInSchema} from '@/lib/schema';
import {useRouter} from 'next/navigation';

import bp_black_transparent from 'G/public/hmm-vstock/bp-black-transparent.png';

export default function SignIn() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const {executeAsync, isExecuting} = useAction(signIn, {
        onSuccess: () => {
            toast.success('Sign in success');
            router.push('/dashboard')
        },
        onError: ({error: {serverError, validationErrors}}) => {
            toast.error(serverError || validationErrors?.toString() || 'Sign in failed');
        },
    });
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (
        data: z.infer<typeof signInSchema>,
        e: BaseSyntheticEvent | undefined
    ) => {
        e?.preventDefault();
        await executeAsync(data);
        form.reset();
    };

    return (
        <div className='relative w-full min-h-dvh flex items-center justify-center'>
            {/* Add images for background */}
            <Image
                // src='/hmm-vstock/bp-black-transparent.png'
                src={bp_black_transparent}
                className=' opacity-20 absolute left-0 bottom-0 w-2/5 md:w-1/6'
                alt='bp-black-transparent'
                width={2000}
                height={2000}
            />
            <Image
                // src='/hmm-vstock/bp-black-transparent.png'
                src={bp_black_transparent}
                className=' opacity-20 absolute right-0 top-0 w-1/3 md:w-1/6'
                alt='bp-black-transparent'
                width={2000}
                height={2000}
            />
            <Form {...form}>
                <form
                    onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
                    className='flex flex-col items-center max-w-64 gap-4'
                >
                    <h1 className=''>Sign In</h1>
                    <h4 className='text-center font-semibold'>
                        Enter your email below to login to your account
                    </h4>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({field: {onChange, ...props}}) => (
                            <FormItem className='w-full'>
                                <FormLabel className='self-start text-navy font-semibold'>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className=''
                                        type='email'
                                        autoFocus
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v.includes('@')) {
                                                form.setValue('email', v.replace(/@.*/, '@mahasiswa.itb.ac.id'));
                                            } else {
                                                form.setValue('email', v.replace("mahasiswa.itb.ac.id", ""));
                                            }
                                        }}
                                        {...props}
                                    />
                                </FormControl>
                                <FormDescription className='text-xs'>
                                    131*****@mahasiswa.itb.ac.id
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({field}) => (
                            <FormItem className='w-full'>
                                <FormLabel className='self-start text-navy font-semibold'>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <div className='relative items-center flex'>
                                        <Input
                                            className=''
                                            type={showPassword ? 'text' : 'password'}
                                            {...field}
                                        />
                                        {showPassword ? (
                                            <FiEye
                                                className='absolute right-3 cursor-pointer text-navy'
                                                onClick={() => setShowPassword(false)}
                                            />
                                        ) : (
                                            <FiEyeOff
                                                className='absolute right-3 cursor-pointer text-navy'
                                                onClick={() => setShowPassword(true)}
                                            />
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button
                        type='submit'
                        className=' rounded-md w-full shadow-md'
                        disabled={isExecuting || !form.formState.isDirty || !form.formState.isValid}
                    >
                        {isExecuting ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <span className='flex gap-1'>
            <h6>{"Don't have account?"}</h6>
            <Link href='/sign-up'>
              <h6 className='font-bold'>Sign up</h6>
            </Link>
          </span>
                </form>
            </Form>
        </div>
    );
}
