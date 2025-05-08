'use client';

import Wrapper from '@/app/portal/admin/wrapper';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import UploadFile from '@/components/UploadFile';
import {beasiswaFormSchema} from '@/lib/schema';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {useCreateInternalScholarshipMutation} from '../_hooks/@post/useInternalScholarship';
import {useAction} from 'next-safe-action/hooks';
import {useRouter} from 'next/navigation';
import {createInternalScholarship} from '@/_actions/scholarship-action';

const fields = [
    {
        name: 'suratPermohonanBeasiswa',
        label:
            'Surat Permohonan Beasiswa Ditanda tangani Orang Tua dan Calon Penerima Beasiswa',
        required: true,
    },
    {
        name: 'suratKeteranganAktif',
        label: 'Surat Keterangan Aktif Kuliah',
        required: true,
    },
    {
        name: 'suratKeteranganTidakMampu',
        label: 'Surat Keterangan Tidak Mampu (opsional)',
    },
    {
        name: 'rincianBiayaUKT',
        label: 'Rincian Biaya UKT Semester Berjalan dan/atau Tunggakan',
        required: true,
    },
    {
        name: 'suratCV',
        label:
            'Curriculum Vitae (Lampirkan Fotokopi KTP Mahasiswa, Kartu Keluarga, dan Kartu Tanda Mahasiswa)',
        required: true,
    },
    {
        name: 'esaiFinansial',
        label: 'Essai Kondisi Finansial Terbaru (500 kata)',
        required: true,
    },
    {
        name: 'tagihanListrik',
        label: 'Tagihan Listrik',
        required: true,
    },
];


type BeasiswaFormValues = {
    namaMahasiswa: string;
    nim: string | undefined;
    angkatan: string | undefined;
    penawaranBeasiswa: string;
    rincianBiaya: string | undefined;
    suratPermohonanBeasiswa: File | null | string;
    suratKeteranganAktif: File | null | string;
    suratKeteranganTidakMampu: File | null | string;
    rincianBiayaUKT: File | undefined | string;
    suratCV: File | null | string;
    esaiFinansial: File | null | string;
    tagihanListrik: File | null | string;
};

export default function RegistrationBeasiswaHMM() {
    const router = useRouter();

    const form = useForm<BeasiswaFormValues>({
        resolver: zodResolver(beasiswaFormSchema),
        mode: 'onChange',
        defaultValues: {
            namaMahasiswa: '',
            nim: '',
            angkatan: '',
            penawaranBeasiswa: '',
            rincianBiaya: '',
            suratPermohonanBeasiswa: '',
            suratKeteranganAktif: '',
            suratKeteranganTidakMampu: '',
            rincianBiayaUKT: '',
            suratCV: '',
            esaiFinansial: '',
            tagihanListrik: '',
        },
    });

    const {execute, status} = useAction(createInternalScholarship, {
        onSuccess: (response: any) => {
            if (response?.data.error) {
                toast.error(response?.data?.error);
                return;
            }
            toast.success('Your data has been submitted successfully');
            router.push('/scholarships/beasiswa-internal');
        },
        onError: (error) => {
            toast.error(error.error?.serverError || 'Failed to submit data');
        },
    })

    const mutation = useCreateInternalScholarshipMutation();


    const onSubmit = (formValues: BeasiswaFormValues) => {
        const pdfFields = [
            'suratPermohonanBeasiswa',
            'suratKeteranganAktif',
            'suratKeteranganTidakMampu',
            'rincianBiayaUKT',
            'suratCV',
            'esaiFinansial',
            'tagihanListrik',
        ];

        const responseItems = Object.entries(formValues).map(([field, value]) => {
            const isPdfField = pdfFields.includes(field);
            return {
                type: isPdfField ? 'PDF' : 'TEXT' as 'PDF' | 'TEXT', // Explicitly cast type to the allowed literals
                field,
                value:
                    value && typeof value === 'object' && value instanceof File
                        ? value.name
                        : value?.toString() || '', // Convert all values to strings
            };
        });

        // execute({ responseItems });

        mutation.mutate(
            {responseItems},
            {
                onSuccess: (response: any) => {
                    if (response?.data.error) {
                        toast.error(response?.data?.error);
                        return;
                    }
                    toast.success('Data Submitted successfully');
                    router.push('/portal/admin/scholarships/beasiswa-internal');
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Gagal mengirim data');
                    console.error(error);
                },
            }
        );
    };


    return (
        <Wrapper>
            <div className='min-h-screen flex items-center justify-center'>
                <div className='max-w-[1355px] p-6 flex flex-col w-full justify-center gap-4'>
                    <h1 className='text-2xl text-center font-bold mb-4 bg-blue-900 text-white p-4 rounded w-full'>
                        Formulir Pendaftaran Beasiswa HMM
                    </h1>

                    <FormProvider {...form}>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='space-y-4'
                                noValidate
                            >
                                <h2 className='text-lg font-bold mb-4'>
                                    Informasi Pendaftaran
                                </h2>

                                <FormField
                                    control={form.control}
                                    name='namaMahasiswa'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nama Mahasiswa<span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder='Masukkan nama lengkap' {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='nim'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                NIM<span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='Misal: 13121142'
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === '' ? '' : value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='angkatan'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Angkatan<span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='Misal: 2021, 2022, 2023'
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === '' ? '' : value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='penawaranBeasiswa'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Beasiswa yang Dibutuhkan
                                                <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='-- Pilih --'/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='Beasiswa UKT'>
                                                            Beasiswa UKT
                                                        </SelectItem>
                                                        <SelectItem value='Beasiswa Bulanan'>
                                                            Beasiswa Bulanan
                                                        </SelectItem>
                                                        <SelectItem value='Beasiswa Tunggakan'>
                                                            Beasiswa Tunggakan
                                                        </SelectItem>
                                                        <SelectItem value='Lainnya'>Lainnya</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='rincianBiaya'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                Rincian Biaya UKT Semester berjalan/tunggakan
                                                <span className='text-red-500'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='Misal: 12500000'
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === '' ? '' : value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <hr className='my-4'/>
                                <h2 className='text-xl font-semibold'>Dokumen Pendukung</h2>

                                {fields.map(({name, label, required}) => (
                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name as keyof BeasiswaFormValues}
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    {label}
                                                    {required && <span className='text-red-500'>*</span>}
                                                </FormLabel>
                                                <FormControl>
                                                    <UploadFile
                                                        sessionIdName={name}
                                                        accept={{'application/pdf': ['.pdf']}}
                                                        maxSizeInBytes={5_000_000}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ))}

                                <Button
                                    type='submit'
                                    className='bg-blue-600 hover:bg-blue-700 text-white'
                                >
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </FormProvider>
                </div>
            </div>
        </Wrapper>
    );
}
