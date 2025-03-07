import {
  FaMoneyBillAlt,
  FaLightbulb,
  FaUsers,
  FaGraduationCap,
} from 'react-icons/fa';

const benefits = [
  {
    title: 'Pendanaan Uang Kuliah Tunggal',
    icon: <FaMoneyBillAlt className="mx-auto w-auto h-[137px] mb-3 text-blue-600" size={28} />,
  },
  {
    title: 'Kegiatan Pengembangan Keterampilan',
    icon: <FaLightbulb className="mx-auto w-auto h-[100px] mb-6 text-blue-600" size={28} />,
  },
  {
    title: 'Penjalinan Relasi dengan Berbagai Pihak',
    icon: <FaUsers className="mx-auto w-auto h-[137px] mb-3 text-blue-600" size={28} />,
  },
  {
    title: 'Potensi Pengalaman Kokurikuler',
    icon: (
      <FaGraduationCap className="mx-auto w-auto h-[137px] mb-3 text-blue-600" size={28} />
    ),
  },
];

export default function ManfaatSection() {
  return (
    <div className="max-w-6xl mx-auto rounded-2xl md:rounded-3xl shadow-xl w-full bg-white">
      <h2 className="text-2xl font-bold text-center bg-blue-700 text-white p-4 rounded-t-2xl md:rounded-t-3xl">
        Manfaat yang Akan Diterima Mahasiswa
      </h2>

      <div className="flex flex-col md:flex-row">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col flex-1 relative px-6 min-h-[400px] items-center justify-center">
            {/* Icon */}
            <div className="mb-4">{benefit.icon}</div>

            {/* Judul dengan garis putus-putus */}
            <div className="text-center pb-4">
              <h3 className="text-lg font-semibold px-2">{benefit.title}</h3>
            </div>

            {/* Garis horizontal antar baris */}
            {index !== benefits.length - 1 && (
              <div className="block md:hidden absolute right-0 bottom-0 w-full h-px">
                <div className="h-full border-r-2 border-dashed border-gray-300" />
              </div>
            )}

            {/* Garis vertikal antar kolom */}
            {index !== benefits.length - 1 && (
              <div className="hidden md:block absolute right-0 top-0 h-full w-[2px]">
                <div className="h-full border-r-2 border-dashed border-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
