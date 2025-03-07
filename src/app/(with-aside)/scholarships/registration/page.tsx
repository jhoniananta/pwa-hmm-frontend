'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
      // Build multipart/form-data
      const formData = new FormData();
      formData.append('namaMahasiswa', formValues.namaMahasiswa);
      formData.append('alamat', formValues.alamat);
      formData.append('asalKota', formValues.asalKota);
      formData.append('penawaranBeasiswa1', formValues.penawaranBeasiswa1);
      formData.append('pilihanPembiayaan', formValues.pilihanPembiayaan);
      formData.append('penawaranBeasiswa2', formValues.penawaranBeasiswa2);
      formData.append('penawaranBeasiswa3', formValues.penawaranBeasiswa3);

      // If the user selected files, append them
      if (formValues.suratKeterangan?.[0]) {
        formData.append('suratKeterangan', formValues.suratKeterangan[0]);
      }
      if (formValues.dokumenKesepakatan?.[0]) {
        formData.append('dokumenKesepakatan', formValues.dokumenKesepakatan[0]);
      }
      if (formValues.dokumenSumberPendanaan?.[0]) {
        formData.append(
          'dokumenSumberPendanaan',
          formValues.dokumenSumberPendanaan[0]
        );
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
    <>
      <div className="max-w-[1355px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Formulir Pendaftaran Beasiswa HMM
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nama Mahasiswa</label>
            <input
              type="text"
              {...register('namaMahasiswa')}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.namaMahasiswa && (
              <p className="text-red-500 text-sm">
                {errors.namaMahasiswa.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Alamat</label>
            <input
              type="text"
              {...register('alamat')}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.alamat && (
              <p className="text-red-500 text-sm">{errors.alamat.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Asal Kota</label>
            <input
              type="text"
              {...register('asalKota')}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.asalKota && (
              <p className="text-red-500 text-sm">{errors.asalKota.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Penawaran Beasiswa 1
            </label>
            <select
              {...register('penawaranBeasiswa1')}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Pilih --</option>
              <option value="Beasiswa Penuh">Beasiswa Penuh</option>
              <option value="Beasiswa Proyek">Beasiswa Proyek</option>
              <option value="Beasiswa Prestasi Tingkat Tinggi">
                Beasiswa Prestasi Tingkat Tinggi
              </option>
              <option value="Beasiswa Loyalty">Beasiswa Loyalty</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.penawaranBeasiswa1 && (
              <p className="text-red-500 text-sm">
                {errors.penawaranBeasiswa1.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Pilihan Pembiayaan</label>
            <input
              type="text"
              {...register('pilihanPembiayaan')}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.pilihanPembiayaan && (
              <p className="text-red-500 text-sm">
                {errors.pilihanPembiayaan.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Penawaran Beasiswa 2
            </label>
            <select
              {...register('penawaranBeasiswa2')}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Pilih --</option>
              <option value="Beasiswa Penuh">Beasiswa Penuh</option>
              <option value="Beasiswa Proyek">Beasiswa Proyek</option>
              <option value="Beasiswa Prestasi Tingkat Tinggi">
                Beasiswa Prestasi Tingkat Tinggi
              </option>
              <option value="Beasiswa Loyalty">Beasiswa Loyalty</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.penawaranBeasiswa2 && (
              <p className="text-red-500 text-sm">
                {errors.penawaranBeasiswa2.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Penawaran Beasiswa 3
            </label>
            <select
              {...register('penawaranBeasiswa3')}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">-- Pilih --</option>
              <option value="Beasiswa Penuh">Beasiswa Penuh</option>
              <option value="Beasiswa Proyek">Beasiswa Proyek</option>
              <option value="Beasiswa Prestasi Tingkat Tinggi">
                Beasiswa Prestasi Tingkat Tinggi
              </option>
              <option value="Beasiswa Loyalty">Beasiswa Loyalty</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.penawaranBeasiswa3 && (
              <p className="text-red-500 text-sm">
                {errors.penawaranBeasiswa3.message}
              </p>
            )}
          </div>

          <hr className="my-4" />

          <h2 className="text-xl font-semibold">Dokumen Pendukung</h2>
          <div>
            <label className="block font-medium mb-1">Surat Keterangan</label>
            <input
              type="file"
              {...register('suratKeterangan')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.suratKeterangan && (
              <p className="text-red-500 text-sm">
                {errors.suratKeterangan.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Dokumen Kesepakatan
            </label>
            <input
              type="file"
              {...register('dokumenKesepakatan')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.dokumenKesepakatan && (
              <p className="text-red-500 text-sm">
                {errors.dokumenKesepakatan.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Dokumen Sumber Pendanaan
            </label>
            <input
              type="file"
              {...register('dokumenSumberPendanaan')}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer"
            />
            {errors.dokumenSumberPendanaan && (
              <p className="text-red-500 text-sm">
                {errors.dokumenSumberPendanaan.message as string}
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
    </>
  );
}
