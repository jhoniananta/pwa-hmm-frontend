'use client';

import React from 'react';
import {ResponseItem} from 'lms-types';
import {ScholarshipResponseForm} from '@/_actions/scholarship-action';
import Wrapper from '@/app/portal/admin/wrapper';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';

const getResponseValue = (
    items: ResponseItem[] | undefined,
    fieldName: string
): string => {
    if (!Array.isArray(items)) {
        return '-';
    }
    const item = items.find((i) => i.field === fieldName);
    return item?.value || '-';
};

export default function ScholarshipInternalDetails({
                                                       data,
                                                   }: {
    data: ScholarshipResponseForm;
}) {
    return (
        <Wrapper>
            <div className='space-y-8'>
                {/* Informasi Pendaftaran */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Informasi Pendaftaran</h2>

                    <div className='space-y-2'>
                        <Label>Nama Mahasiswa</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'namaMahasiswa')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>NIM</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'nim')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Angkatan</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'angkatan')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Penawaran Beasiswa</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'penawaranBeasiswa')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Rincian Biaya</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'rincianBiaya')}
                            disabled
                        />
                    </div>
                </div>

                {/* Dokumen Pendukung */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold'>Dokumen Pendukung</h2>

                    <div className='space-y-2'>
                        <Label>Surat Permohonan Beasiswa</Label>
                        <Input
                            value={getResponseValue(
                                data.responseItems,
                                'suratPermohonanBeasiswa'
                            )}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Surat Keterangan Aktif Kuliah</Label>
                        <Input
                            value={getResponseValue(
                                data.responseItems,
                                'suratKeteranganAktif'
                            )}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Surat Keterangan Tidak Mampu</Label>
                        <Input
                            value={getResponseValue(
                                data.responseItems,
                                'suratKeteranganTidakMampu'
                            )}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Rincian Biaya UKT</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'rincianBiayaUKT')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Curriculum Vitae (CV)</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'suratCV')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Esai Finansial</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'esaiFinansial')}
                            disabled
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Tagihan Listrik</Label>
                        <Input
                            value={getResponseValue(data.responseItems, 'tagihanListrik')}
                            disabled
                        />
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}
