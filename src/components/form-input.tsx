import { signUpSchema } from '@/lib/schema';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, ChangeEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './ui/form';

interface FormInputProps {
  index: number;
  name: keyof z.infer<typeof signUpSchema>;
  form: UseFormReturn<{
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    lineId: string;
    bloodType: string;
    emergencyNumber: string;
    medicalHistories: string[];
    hobbies: string[];
    UKM: string[];
    password?: string;
    confirmPassword?: string;
  }>;
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
}

export default function FormInput({
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
}: FormInputProps) {
  const [show, setShow] = useState(false);
  const [_value, setValue] = useState('');

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...props } }) => (
        <FormItem className='w-full space-y-1'>
          <FormLabel className='self-start text-navy font-semibold'>
            {optional ? label : label + '*'}
          </FormLabel>
          {isArray && (
            <div className='w-full flex flex-wrap gap-2'>
              {(form.getValues(name) as string[])?.map((v) => (
                <motion.div
                  key={v}
                  className='bg-navy/90 flex py-1 gap-1 items-center text-white font-medium px-1.5 text-xs rounded-md'
                >
                  {v}
                  <X
                    className='w-3 h-3 text-white cursor-pointer'
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
              <div className='relative items-center flex'>
                <Input
                  className=''
                  type={show ? 'text' : 'password'}
                  onChange={onChange}
                  {...props}
                />
                {show ? (
                  <FiEye
                    className='absolute right-3 cursor-pointer text-navy'
                    onClick={() => setShow(false)}
                  />
                ) : (
                  <FiEyeOff
                    className='absolute right-3 cursor-pointer text-navy'
                    onClick={() => setShow(true)}
                  />
                )}
              </div>
            ) : (
              <div className='relative items-center flex'>
                <Input
                  className=''
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
                    className={`absolute right-3 transform ${_value.length < 3 || value?.length! >= 5 || (value as string[]).includes(_value)
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
            <FormDescription className='text-xs'>{desc}</FormDescription>
          )}
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
}