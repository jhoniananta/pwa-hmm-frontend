'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MotionFramer from '@/components/client/modal-framer';
import MotionOverlay from '@/components/client/modal-overlay';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAction } from 'next-safe-action/hooks';
import { createEnrollment } from '@/_actions/enrollment-action';
import { toast } from 'sonner';
import ErrorText from '@/app/portal/admin/error-text';
import { useRouter } from 'next/navigation';

export default function EnrollmentModal({ 
  courseId,
  courseTitle 
}: { 
  courseId: number;
  courseTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | undefined>();
  const router = useRouter();

  const { execute, status } = useAction(createEnrollment, {
    onSuccess: () => {
      toast.success('Successfully enrolled in course');
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error?.serverError || 'Failed to enroll in course');
    },
  });

  const handleEnroll = () => {
    if (!role) {
      toast.error('Please select a role');
      return;
    }
    execute({ courseId, role });
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className='bg-navy rounded-full font-semibold py-1.5 text-white hover:bg-navy/80 transition px-6 text-sm md:text-base'
      >
        Enroll Now
      </Button>

      <AnimatePresence>
        {isOpen && (
          <MotionFramer
            id="enrollment-modal"
            className='border border-navy'
          >
            <div className='flex flex-col gap-4 p-4'>
              <motion.h3>
                Enroll in {courseTitle}
              </motion.h3>
              
              <div className='space-y-2'>
                <Label>Select Role</Label>
                <Select onValueChange={(value) => setRole(value as 'STUDENT' | 'TEACHER')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                  </SelectContent>
                </Select>
                {!role && status === 'hasErrored' && (
                  <ErrorText>Role is required</ErrorText>
                )}
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className='bg-navy'
                  onClick={handleEnroll}
                  disabled={status === 'executing'}
                >
                  {status === 'executing' ? 'Enrolling...' : 'Enroll'}
                </Button>
              </div>
            </div>
          </MotionFramer>
        )}
      </AnimatePresence>

      <MotionOverlay
        show={isOpen}
        setActive={setIsOpen}
        setTo={false}
      />
    </>
  );
} 