'use client';
import React from 'react';
import AdminBreadcrumb from '@/components/admin/breadcrumb';
import AdminHeader from '@/components/admin/header';
import { useParams, useSearchParams } from 'next/navigation';
import Wrapper from '../../../../wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateScholarshipSchema } from '@/lib/schema';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScholarshipFundingModel } from 'lms-types';
import { useAction } from 'next-safe-action/hooks';
import { updateScholarship } from '@/_actions/scholarship-action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultValues = {
    scholarshipId: Number(id),
    title: searchParams.get('title') || '',
    description: searchParams.get('description') || '',
    provider: searchParams.get('provider') || '',
    deadline: new Date(searchParams.get('deadline') || Date.now()),
    reference: searchParams.get('reference') || '',
    funding: searchParams.get('funding') as ScholarshipFundingModel || undefined,
    scope: searchParams.get('scope') || '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof updateScholarshipSchema>>({
    resolver: zodResolver(updateScholarshipSchema),
    defaultValues,
  });

  const { execute: executeUpdateScholarship, isExecuting } = useAction(updateScholarship, {
    onSuccess: () => {
      toast.success('Scholarship updated successfully');
      router.push('/portal/admin/scholarships');
    },
    onError: ({ error: { serverError, validationErrors, fetchError } }) => {
      toast.error(
        serverError ||
          fetchError ||
          validationErrors?.toString() ||
          'Failed to update scholarship'
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    executeUpdateScholarship(data);
  });

  return (
    <>
      <AdminHeader title='Edit Scholarship' />
      <AdminBreadcrumb />
      <Wrapper>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <Label>Title</Label>
            <Input {...register('title')} />
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>

          <div>
            <Label>Provider</Label>
            <Input {...register('provider')} />
            {errors.provider && <span className="text-red-500 text-sm">{errors.provider.message}</span>}
          </div>

          <div>
            <Label>Deadline</Label>
            <Input
              type='datetime-local'
              {...register('deadline', {
                setValueAs: (value) => new Date(value),
              })}
            />
            {errors.deadline && <span className="text-red-500 text-sm">{errors.deadline.message}</span>}
          </div>

          <div>
            <Label>Reference URL</Label>
            <Input type='url' {...register('reference')} />
            {errors.reference && <span className="text-red-500 text-sm">{errors.reference.message}</span>}
          </div>

          <div>
            <Label>Funding Type</Label>
            <Select
              onValueChange={(value) => setValue('funding', value as ScholarshipFundingModel)}
              defaultValue={defaultValues.funding}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select funding type' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='FULLY_FUNDED'>Fully Funded</SelectItem>
                  <SelectItem value='PARTIALLY_FUNDED'>Partially Funded</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.funding && <span className="text-red-500 text-sm">{errors.funding.message}</span>}
          </div>

          <div>
            <Label>Scope</Label>
            <Input {...register('scope')} />
            {errors.scope && <span className="text-red-500 text-sm">{errors.scope.message}</span>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} rows={5} />
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>

          <Button type='submit' className='bg-navy' disabled={isExecuting}>
            {isExecuting ? 'Updating...' : 'Update Scholarship'}
          </Button>
        </form>
      </Wrapper>
    </>
  );
} 