'use client';

import { signUp } from '@/_actions/user-action';
import Spinner from '@/components/client/spinner';
import Button from '@/components/ui/button/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowBigLeft, ArrowBigRight, Check, Plus, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type BaseSyntheticEvent, ChangeEvent, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'sonner';
import { z } from 'zod';

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prevStep, setPrevStep] = useState(2);
  const { executeAsync, isExecuting, hasSucceeded, hasErrored } = useAction(
    signUp,
    {
      onSuccess: (data) => {
        toast.success(data.data?.message || 'Sign up success');
        router.push('/sign-in');
      },
      onError: ({
        error: { serverError, validationErrors, bindArgsValidationErrors },
      }) => {
        toast.error(
          serverError ||
            validationErrors?.toString() ||
            bindArgsValidationErrors ||
            'Sign up failed'
        );
      },
    }
  );
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phoneNumber: '',
      dateOfBirth: '',
      lineId: '',
      bloodType: undefined,
      emergencyNumber: '',
      medicalHistories: [],
      hobbies: [],
      UKM: [],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof signUpSchema>,
    e: BaseSyntheticEvent | undefined
  ) => {
    e?.preventDefault();
    await executeAsync(data);

    if (hasSucceeded && !hasErrored) {
      form.reset();
    }
    setStep(1);
  };
  const dir = step > prevStep ? 'right' : 'left';

  return (
    <div className="relative w-full min-h-dvh flex items-center justify-center">
      {/* Add images for background */}
      <Image
        src="/hmm-vstock/bp-black-transparent.png"
        className=" opacity-20 absolute z-0 left-0 bottom-0 w-2/5 md:w-1/6"
        alt="bp-black-transparent"
        width={2000}
        height={2000}
      />
      <Image
        src="/hmm-vstock/bp-black-transparent.png"
        className=" opacity-20 absolute z-0 right-0 top-0 w-1/3 md:w-1/6"
        alt="bp-black-transparent"
        width={2000}
        height={2000}
      />
      <Form {...form}>
        <form
          onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
          className="flex flex-col items-center max-w-64 gap-4 z-[1]"
        >
          <h1 className="">Sign Up</h1>
          <h4 className="text-center font-semibold">
            Enter your details below to sign up a new account
          </h4>
          <div className="flex w-full justify-between text-xs">
            <button
              onClick={() => {
                setStep(1);
                form.reset();
              }}
              className="text-red-600"
            >
              Clear
            </button>
            <p className="text-left text-xs text-navy">
              Step{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: 10 }}
                  key={`step-signup-${step}`}
                >
                  {step}
                </motion.span>
              </AnimatePresence>
              /{steps.length}
            </p>
          </div>
          {!form.formState.isValid && form.formState.submitCount > 0 && (
            <p className="text-red-600 text-xs text-left w-full">
              Please recheck the inputs
            </p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              className="flex flex-col gap-4 w-full"
              key={`form-signup-${step}`}
              initial={{
                opacity: 0,
                x: step === prevStep ? '0' : dir === 'right' ? '100%' : '-100%',
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x:
                  prevStep === 2 && step === 1
                    ? '-100%'
                    : dir === 'right'
                    ? '-100%'
                    : '100%',
              }}
              transition={{ duration: 0.2, type: 'tween' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (e.shiftKey) {
                    const button = document.getElementById(
                      'prev-button-sign-up'
                    );
                    button?.click();
                    return;
                  }
                  const button = document.getElementById(
                    'submit-button-sign-up'
                  );
                  button?.click();
                } else if (e.key === 'Escape') {
                  setStep(1);
                  form.reset();
                }
              }}
            >
              {steps[step - 1].map((step, i) => (
                <FormInput
                  key={step.name + 'sign-up-page'}
                  index={i}
                  name={step.name}
                  form={form}
                  type={step.type}
                  isPassword={step.isPassword ?? false}
                  desc={step.desc}
                  label={step.label}
                  autoCompletion={step.autoCompletion}
                  isArray={step.isArray}
                  optional={step.optional}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="w-full flex justify-between items-center">
            <Button
              id="prev-button-sign-up"
              type="button"
              onClick={() => {
                if (step > 1) {
                  setPrevStep(step);
                  setStep(step - 1);
                }
              }}
              disabled={step === 1}
              className="aspect-square p-0 flex items-center justify-center w-12 h-12 bg-transparent border border-navy text-navy hover:bg-navy/10 transition-all"
            >
              <ArrowBigLeft />
            </Button>
            <Button
              id="submit-button-sign-up"
              type={step === steps.length ? 'button' : 'button'}
              disabled={
                isExecuting ||
                form.formState.isSubmitting ||
                (!form.formState.isDirty && step === steps.length)
              }
              className={`aspect-square p-0 flex items-center justify-center w-12 h-12 bg-transparent border border-navy text-navy hover:bg-navy/10 transition-all ${
                step === steps.length && 'border-green-600 text-green-500'
              }`}
              onClick={(e) => {
                if (step < steps.length) {
                  setPrevStep(step);
                  setStep(step + 1);
                } else {
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            >
              {isExecuting ? (
                <Spinner className="h-4 w-4" />
              ) : step === steps.length ? (
                <Check />
              ) : (
                <ArrowBigRight />
              )}
            </Button>
          </div>
          <span className="flex gap-1">
            <h6>{'Already have account?'}</h6>
            <Link href="/sign-in">
              <h6 className="font-bold">Sign in</h6>
            </Link>
          </span>
        </form>
      </Form>
    </div>
  );
}

type stepType = {
  name: keyof z.infer<typeof signUpSchema>;
  type: 'text' | 'email' | 'password' | 'date';
  isPassword?: boolean;
  desc?: string;
  label: string;
  autoCompletion?: {
    replaceReg: RegExp;
    replace: string;
    replacement: string;
  };
  optional?: boolean;
  isArray?: boolean;
};

const step1: stepType[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    desc: '131*****@mahasiswa.itb.ac.id',
    autoCompletion: {
      replaceReg: /@.*/,
      replace: '@',
      replacement: '@mahasiswa.itb.ac.id',
    },
  },
  {
    name: 'password',
    type: 'password',
    isPassword: true,
    label: 'Password',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    isPassword: true,
    label: 'Confirm Password',
  },
];

const step2: stepType[] = [
  {
    name: 'address',
    type: 'text',
    label: 'Address',
  },
  {
    name: 'phoneNumber',
    type: 'text',
    label: 'Phone',
    desc: '08xxxxxxxxxx',
  },
  {
    name: 'dateOfBirth',
    type: 'date',
    label: 'Date of Birth',
  },
  {
    name: 'lineId',
    type: 'text',
    label: 'Line ID',
  },
];

const step3: stepType[] = [
  {
    name: 'bloodType',
    type: 'text',
    label: 'Blood Type',
    desc: 'A, B, AB, O',
  },
  {
    name: 'emergencyNumber',
    type: 'text',
    label: 'Emergency Number',
  },
  {
    name: 'medicalHistories',
    type: 'text',
    label: 'Medical History',
    isArray: true,
    optional: true,
  },
];

const step4: stepType[] = [
  {
    name: 'hobbies',
    type: 'text',
    label: 'Hobbies',
    isArray: true,
    optional: true,
  },
  {
    name: 'UKM',
    type: 'text',
    label: 'Unit Kegiatan Mahasiswa',
    desc: 'e.g. PSM ITB, URO ITB, etc.',
    isArray: true,
    optional: true,
  },
];

const steps = [step1, step2, step3, step4];

function FormInput({
  index,
  name,
  form,
  type = 'text',
  isPassword = false,
  desc,
  label,
  autoCompletion = undefined,
  isArray = false,
  optional = false,
}: {
  index: number;
  name: keyof z.infer<typeof signUpSchema>;
  form: UseFormReturn<z.infer<typeof signUpSchema>>;
  type: 'text' | 'email' | 'password' | 'date';
  isPassword: boolean;
  desc?: string;
  label: string;
  autoCompletion?: {
    replaceReg: RegExp;
    replace: string;
    replacement: string;
  };
  isArray?: boolean;
  optional?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [_value, setValue] = useState('');

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...props } }) => (
        <FormItem className="w-full space-y-1">
          <FormLabel className="self-start text-navy font-semibold">
            {optional ? label : label + '*'}
          </FormLabel>
          {isArray && (
            <div className="w-full flex flex-wrap gap-2">
              {(form.getValues(name) as string[])?.map((v) => (
                <motion.div
                  key={v}
                  className="bg-navy/90 flex py-1 gap-1 items-center text-white font-medium px-1.5 text-xs rounded-md"
                >
                  {v}
                  <X
                    className="w-3 h-3 text-white cursor-pointer"
                    strokeWidth={3}
                    onClick={() =>
                      form.setValue(
                        name,
                        (value as string[]).filter((i) => i !== v)
                      )
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
          <FormControl>
            {isPassword ? (
              <div className="relative items-center flex">
                <Input
                  className=""
                  type={show ? 'text' : 'password'}
                  onChange={onChange}
                  {...props}
                />
                {show ? (
                  <FiEye
                    className="absolute right-3 cursor-pointer text-navy"
                    onClick={() => setShow(false)}
                  />
                ) : (
                  <FiEyeOff
                    className="absolute right-3 cursor-pointer text-navy"
                    onClick={() => setShow(true)}
                  />
                )}
              </div>
            ) : (
              <div className="relative items-center flex">
                <Input
                  className=""
                  id={'input-signup-' + name}
                  type={type}
                  autoFocus={index === 0}
                  onChange={
                    autoCompletion
                      ? (e: ChangeEvent<HTMLInputElement>) => {
                          const v = e.target.value;
                          if (v.includes(autoCompletion.replace)) {
                            form.setValue(
                              name,
                              v.replace(
                                autoCompletion.replaceReg,
                                autoCompletion.replacement
                              )
                            );
                          } else {
                            form.setValue(
                              name,
                              v.replace(
                                autoCompletion.replacement.replace(
                                  autoCompletion.replace,
                                  ''
                                ),
                                ''
                              )
                            );
                          }
                        }
                      : isArray
                      ? (e: ChangeEvent<HTMLInputElement>) => {
                          setValue(e.target.value);
                        }
                      : onChange
                  }
                  value={isArray ? _value : value}
                  {...props}
                />
                {isArray && (
                  <Plus
                    className={`absolute right-3 transform ${
                      _value.length < 3 ||
                      value?.length! >= 5 ||
                      (value as string[]).includes(_value)
                        ? 'text-navy/50 cursor-not-allowed'
                        : 'text-navy cursor-pointer'
                    }`}
                    onClick={() => {
                      if (_value.length < 3) return;
                      if (value?.length! >= 5) return;
                      if ((value as string[]).includes(_value)) return;
                      form.setValue(name, [...(value as string[]), _value]);
                      setValue('');
                      const input = document.getElementById(
                        'input-signup-' + name
                      );
                      input?.focus();
                    }}
                  />
                )}
              </div>
            )}
          </FormControl>
          {desc && (
            <FormDescription className="text-xs">{desc}</FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
