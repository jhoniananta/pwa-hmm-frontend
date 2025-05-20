'use client';

import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/lib/utils';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import {getPublicUrl} from "@/_actions/utils/utils";

export default function MultiStepPage() {
    const [activeStep, setActiveStep] = useState(1);
    const [expandedMobileStep, setExpandedMobileStep] = useState<number | null>(
        null
    );

    const steps = [
        {
            id: 1,
            title: 'Alur Tahap 1',
            content:
                'Pada tahap ini, pengguna akan diminta untuk memasukkan informasi dasar seperti nama, email, dan nomor telepon.',
            images: [],
        },
        {
            id: 2,
            title: 'Alur Tahap 2',
            content:
                'Pada tahap ini, mahasiswa akan diminta untuk melakukan pengisian data-data penting yang dibutuhkan dalam rangka seleksi dan penyaringan calon penerima beasiswa.',
            images: [
                getPublicUrl('/assets/images/informasi-beasiswa/bg-kart.png'),
                '/placeholder.svg?height=200&width=300',
            ],
        },
        {
            id: 3,
            title: 'Alur Tahap 3',
            content:
                'Pada tahap ini, pengguna akan diminta untuk mengunggah dokumen pendukung seperti transkrip nilai dan surat rekomendasi.',
            images: [],
        },
        {
            id: 4,
            title: 'Alur Tahap 4',
            content:
                'Pada tahap ini, pengguna akan mengisi informasi tentang riwayat pendidikan dan prestasi akademik yang pernah diraih.',
            images: [],
        },
        {
            id: 5,
            title: 'Alur Tahap 5',
            content:
                'Pada tahap ini, pengguna akan mengisi informasi tentang pengalaman organisasi dan kegiatan ekstrakurikuler.',
            images: [],
        },
        {
            id: 6,
            title: 'Alur Tahap 6',
            content:
                'Pada tahap ini, pengguna akan melakukan konfirmasi akhir dan mengirimkan aplikasi beasiswa.',
            images: [],
        },
    ];

    const toggleMobileStep = (stepId: number) => {
        if (expandedMobileStep === stepId) {
            setExpandedMobileStep(null);
        } else {
            setExpandedMobileStep(stepId);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header with buttons */}
                <div className="flex justify-end gap-4 mb-6">
                    <Button
                        variant="outline"
                        className="rounded-full bg-white hover:bg-slate-100"
                    >
                        <Link href="/scholarships/beasiswa-internal">
                            Informasi Umum
                        </Link>
                    </Button>
                    <Button className="rounded-full bg-indigo-950 hover:bg-indigo-900">
                        <Link href="/scholarships/registration">
                            Daftar Sekarang
                        </Link>
                    </Button>
                </div>

                {/* Main content */}
                <div className="flex flex-col md:flex-row gap-0">
                    {/* Sidebar for desktop */}
                    <div
                        className="hidden md:block w-64 h-full overflow-hidden rounded-l-xl border border-r-0 border-gray-200">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                className={cn(
                                    'w-full text-left p-7 font-medium transition-colors border-b border-gray-200 last:border-b-0',
                                    activeStep === step.id
                                        ? 'bg-[#394290] text-white'
                                        : 'bg-ungu text-white hover:bg-[#394290]'
                                )}
                            >
                                {step.title}
                            </button>
                        ))}
                    </div>

                    {/* Mobile accordion */}
                    <div className="md:hidden space-y-2">
                        {steps.map((step) => (
                            <div key={step.id} className="rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleMobileStep(step.id)}
                                    className="w-full flex items-center justify-between p-4 bg-ungu text-white font-medium"
                                >
                                    <span>{step.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            'h-5 w-5 transition-transform',
                                            expandedMobileStep === step.id
                                                ? 'transform rotate-180'
                                                : ''
                                        )}
                                    />
                                </button>
                                {expandedMobileStep === step.id && (
                                    <div className="p-4 bg-white border border-t-0 border-gray-200 rounded-b-lg">
                                        {step.images.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                {step.images.map((image, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gray-200 rounded-lg overflow-hidden"
                                                    >
                                                        <Image
                                                            unoptimized={true}
                                                            src={image || '/placeholder.svg'}
                                                            alt={`Gambar optional ${idx + 1}`}
                                                            width={300}
                                                            height={200}
                                                            className="w-full h-auto"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-gray-700">{step.content}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content area for desktop */}
                    <div
                        className="hidden md:block flex-1 bg-white rounded-r-xl border border-gray-200 border-l-0 overflow-hidden">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={cn(
                                    'p-6',
                                    activeStep === step.id ? 'block' : 'hidden'
                                )}
                            >
                                <h2 className="text-xl font-bold mb-4">{step.title}</h2>

                                {step.images.length > 0 && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                        {step.images.map((image, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-gray-200 rounded-lg overflow-hidden"
                                            >
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        unoptimized={true}
                                                        src={image || '/placeholder.svg'}
                                                        alt={`Gambar optional ${idx + 1}`}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className="text-gray-700">{step.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
