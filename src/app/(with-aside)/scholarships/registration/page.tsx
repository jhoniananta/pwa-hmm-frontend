'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import type { z } from 'zod';
import { beasiswaFormSchema } from '@/lib/schema';

type BeasiswaFormValues = z.infer<typeof beasiswaFormSchema>;
export default function RegistrationBeasiswaHMM() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BeasiswaFormValues>({
    resolver: zodResolver(beasiswaFormSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (formValues: BeasiswaFormValues) => {
    try {
      const formData = new FormData();

      // Basic Information
      formData.append('namaMahasiswa', formValues.namaMahasiswa);
      formData.append('nim', String(formValues.nim));
      formData.append('angkatan', String(formValues.angkatan));
      formData.append('penawaranBeasiswa', formValues.penawaranBeasiswa);
      formData.append('rincianBiaya', String(formValues.rincianBiaya));

      // File uploads
      if (formValues.suratPermohonanBeasiswa?.[0]) {
        formData.append(
          'suratPermohonanBeasiswa',
          formValues.suratPermohonanBeasiswa[0]
        );
      }
      if (formValues.suratKeteranganAktif?.[0]) {
        formData.append(
          'suratKeteranganAktif',
          formValues.suratKeteranganAktif[0]
        );
      }
      if (formValues.suratKeteranganTidakMampu?.[0]) {
        formData.append(
          'suratKeteranganTidakMampu',
          formValues.suratKeteranganTidakMampu[0]
        );
      }
      if (formValues.rincianBiayaUKT?.[0]) {
        formData.append('rincianBiayaUKT', formValues.rincianBiayaUKT[0]);
      }
      if (formValues.slipGaji?.[0]) {
        formData.append('slipGaji', formValues.slipGaji[0]);
      }
      if (formValues.suratCV?.[0]) {
        formData.append('suratCV', formValues.suratCV[0]);
      }
      if (formValues.esaiFinansial?.[0]) {
        formData.append('esaiFinansial', formValues.esaiFinansial[0]);
      }
      if (formValues.tagihanListrik?.[0]) {
        formData.append('tagihanListrik', formValues.tagihanListrik[0]);
      }

      // POST to our API route
      const res = await fetch('/api/beasiswa', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');

      alert('Data submitted successfully!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="max-w-[1355px] p-6 flex flex-col w-full justify-center gap-4">
        <h1 className="text-2xl text-center font-bold mb-4 bg-blue-900 text-white p-4 rounded w-full">
          Formulir Pendaftaran Beasiswa HMM
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-lg font-bold mb-4">Informasi Pendaftaran</h2>
          {/* Field Nama */}
          <div>
            <label className="block font-medium mb-1">Nama Mahasiswa</label>
            <input
              type="text"
              {...register('namaMahasiswa')}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder='Masukkan nama lengkap'
            />
            {errors.namaMahasiswa && (
              <p className="text-red-500 text-sm">
                {errors.namaMahasiswa.message}
              </p>
            )}
          </div>
          
          {/* Field NIM */}
          <div>
            <label className="block font-medium mb-1">NIM</label>
            <input
              type="text"
              {...register('nim')}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder='Misal: 13121142'
            />
            {errors.nim && (
              <p className="text-red-500 text-sm">{errors.nim.message}</p>
            )}
          </div>

          {/* Field Angkatan */}
          <div>
            <label className="block font-medium mb-1">Angkatan</label>
            <input
              type="text"
              {...register('angkatan')}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder='Misal: 2021, 2022, 2023'
            />
            {errors.angkatan && (
              <p className="text-red-500 text-sm">{errors.angkatan.message}</p>
            )}
          </div>
          
          {/* Select option Penawaran Beasiswa */}
          <div>
            <label className="block font-medium mb-1">
              Beasiswa yang Dibutuhkan
            </label>
            <select
              {...register('penawaranBeasiswa')}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Pilih --</option>
              <option value="Beasiswa UKT">Beasiswa UKT</option>
              <option value="Beasiswa Bulanan">Beasiswa Bulanan</option>
              <option value="Beasiswa Tunggakan">
                Beasiswa Tunggakan
              </option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.penawaranBeasiswa && (
              <p className="text-red-500 text-sm">
                {errors.penawaranBeasiswa.message}
              </p>
            )}
          </div>
          
          {/* Field Rincian Biaya */}
          <div>
            <label className="block font-medium mb-1">Rincian Biaya UKT Semester berjalan/tunggakan</label>
            <input
              type="text"
              {...register('rincianBiaya')}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder='Misal: 12.500.000'
            />
            {errors.rincianBiaya && (
              <p className="text-red-500 text-sm">
                {errors.rincianBiaya.message}
              </p>
            )}
          </div>

          <hr className="my-4" />

          <h2 className="text-xl font-semibold">Dokumen Pendukung</h2>
          <div>
            <label className="block font-medium mb-1">Surat Permohonan Beasiswa Ditanda tangani Orang Tua dan Calon Penerima Beasiswa</label>
            <input
              type="file"
              {...register('suratPermohonanBeasiswa')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.suratPermohonanBeasiswa && (
              <p className="text-red-500 text-sm">
                {errors.suratPermohonanBeasiswa.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Surat Keterangan Aktif Kuliah
            </label>
            <input
              type="file"
              {...register('suratKeteranganAktif')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.suratKeteranganAktif && (
              <p className="text-red-500 text-sm">
                {errors.suratKeteranganAktif.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Surat Keterangan Tidak Mampu (opsional)
            </label>
            <input
              type="file"
              {...register('suratKeteranganTidakMampu')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.suratKeteranganTidakMampu && (
              <p className="text-red-500 text-sm">
                {errors.suratKeteranganTidakMampu.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Rincian Biaya UKT Semester Berjalan dan/atau Tunggakan
            </label>
            <input
              type="file"
              {...register('rincianBiayaUKT')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.rincianBiayaUKT && (
              <p className="text-red-500 text-sm">
                {errors.rincianBiayaUKT.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Curriculum Vitae (Lampirkan Fotokopi KTP Mahasiswa, Kartu Keluarga, dan Kartu Tanda Mahasiswa)
            </label>
            <input
              type="file"
              {...register('suratCV')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.suratCV && (
              <p className="text-red-500 text-sm">
                {errors.suratCV.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Essai Kondisi Finansial Terbaru (500 kata)
            </label>
            <input
              type="file"
              {...register('esaiFinansial')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.esaiFinansial && (
              <p className="text-red-500 text-sm">
                {errors.esaiFinansial.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Tagihan Listrik
            </label>
            <input
              type="file"
              {...register('tagihanListrik')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.tagihanListrik && (
              <p className="text-red-500 text-sm">
                {errors.tagihanListrik.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
