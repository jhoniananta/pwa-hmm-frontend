'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addScholarshipSchema } from '@/lib/schema';
import { useAction } from 'next-safe-action/hooks';
import { createScholarship } from '@/_actions/scholarship-action';
import { toast } from 'sonner';
import ErrorText from '@/app/portal/admin/error-text';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { ScholarshipFundingModel } from 'lms-types';

function AddForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof addScholarshipSchema>>({
    resolver: zodResolver(addScholarshipSchema),
    defaultValues: {
      title: '',
      description: '',
      provider: '',
      deadline: new Date(),
      reference: '',
      funding: undefined,
      scope: '',
    },
  });

  const { execute, status } = useAction(createScholarship, {
    onSuccess: () => {
      toast.success('Scholarship added successfully');
      router.push('/portal/admin/scholarships');
    },
    onError: (error) => {
      toast.error(error.error?.serverError || 'Failed to add scholarship');
    },
  });

  const onSubmit = handleSubmit((data) => {
    execute(data);
  });

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div>
        <Label>Title</Label>
        <Input {...register('title')} placeholder="Enter scholarship title" />
        {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
      </div>

      <div>
        <Label>Provider</Label>
        <Input {...register('provider')} placeholder="Enter scholarship provider" />
        {errors.provider && <ErrorText>{errors.provider.message}</ErrorText>}
      </div>

      <div>
        <Label>Deadline</Label>
        <Input
          type='datetime-local'
          {...register('deadline', {
            setValueAs: (value) => new Date(value),
          })}
        />
        {errors.deadline && <ErrorText>{errors.deadline.message}</ErrorText>}
      </div>

      <div>
        <Label>Reference URL</Label>
        <Input
          type='url'
          {...register('reference')}
          placeholder="https://example.com"
        />
        {errors.reference && <ErrorText>{errors.reference.message}</ErrorText>}
      </div>

      <div>
        <Label>Funding Type</Label>
        <Select
          onValueChange={(value) =>
            setValue('funding', value as ScholarshipFundingModel)
          }
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select funding type' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='FULLY_FUNDED'>Fully Funded</SelectItem>
              <SelectItem value='PARTIALLY_FUNDED'>Partially Funded</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.funding && <ErrorText>{errors.funding.message}</ErrorText>}
      </div>

      <div>
        <Label>Scope</Label>
        <Input
          {...register('scope')}
          placeholder="Enter scholarship scope"
        />
        {errors.scope && <ErrorText>{errors.scope.message}</ErrorText>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          {...register('description')}
          placeholder="Enter scholarship description"
          rows={5}
        />
        {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
      </div>

      <Button
        type='submit'
        className='bg-navy mt-6'
        disabled={status === 'executing'}
      >
        {status === 'executing' ? 'Adding...' : 'Add Scholarship'}
      </Button>
    </form>
  );
}

export default AddForm; 