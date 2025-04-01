'use client';

import { editProfile } from '@/_actions/user-action';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProfileSchema } from '@/lib/schema';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowBigLeft, ArrowBigRight, Check } from 'lucide-react';
import Button from '@/components/ui/button/button';
import FormInput from '@/components/form-input';
import { z } from 'zod';
import { type PublicUserModel } from 'lms-types';

type FormField = {
  name: keyof z.infer<typeof editProfileSchema>;
  type: 'email' | 'date' | 'text' | 'password';
  label: string;
  isArray?: boolean;
};

const step1: FormField[] = [
  { name: 'name', type: 'text', label: 'Name' },
  { name: 'email', type: 'email', label: 'Email' },
];

const step2: FormField[] = [
  { name: 'address', type: 'text', label: 'Address' },
  { name: 'phoneNumber', type: 'text', label: 'Phone Number' },
  { name: 'dateOfBirth', type: 'date', label: 'Date of Birth' },
  { name: 'lineId', type: 'text', label: 'Line ID' },
];

const step3: FormField[] = [
  { name: 'bloodType', type: 'text', label: 'Blood Type' },
  { name: 'emergencyNumber', type: 'text', label: 'Emergency Number' },
  { name: 'medicalHistories', type: 'text', label: 'Medical Histories', isArray: true },
];

const step4: FormField[] = [
  { name: 'hobbies', type: 'text', label: 'Hobbies', isArray: true },
  { name: 'UKM', type: 'text', label: 'UKM', isArray: true },
];

const steps: FormField[][] = [step1, step2, step3, step4];

export default function EditProfile({ user }: { user: PublicUserModel }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prevStep, setPrevStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber || '',
      dateOfBirth: user.dateOfBirth as unknown as string,
      lineId: user.lineId || '',
      bloodType: user.bloodType || '',
      emergencyNumber: user.emergencyNumber || '',
      medicalHistories: user.medicalHistories || [],
      hobbies: user.hobbies || [],
      UKM: user.UKM || [],
    },
  });

  const { execute, isExecuting } = useAction(editProfile, {
    onSuccess: () => {
      toast.success('Profile updated successfully');
      router.push('/profile');
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to update profile');
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editProfileSchema>> = async (data, e) => {
    e?.preventDefault();
    await execute(data);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Form {...form}>
        <form 
          onSubmit={(e) => {
            if (step === steps.length) {
              form.handleSubmit(onSubmit)(e);
            } else {
              e.preventDefault();
            }
          }} 
          className="space-y-6"
        >
          {/* Step indicator */}
          <div className="flex justify-between items-center">
            <span className="text-sm">Step {step}/{steps.length}</span>
          </div>

          {/* Form fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: step > prevStep ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step > prevStep ? -100 : 100 }}
              className="space-y-4"
            >
              {steps[step - 1].map((field, index) => (
                <FormInput
                  key={field.name}
                  index={index}
                  form={form}
                  isPassword={false}
                  {...field}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={() => {
                setPrevStep(step);
                setStep(step - 1);
              }}
              disabled={step === 1}
            >
              <ArrowBigLeft className="w-6 h-6" />
            </Button>

            <Button
              type={step === steps.length ? 'submit' : 'button'}
              onClick={() => {
                if (step < steps.length) {
                  setPrevStep(step);
                  setStep(step + 1);
                }
              }}
              disabled={isExecuting}
            >
              {step === steps.length ? (
                <Check className="w-6 h-6" />
              ) : (
                <ArrowBigRight className="w-6 h-6" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
