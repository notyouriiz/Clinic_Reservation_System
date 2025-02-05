import { v4 as uuidv4 } from 'uuid'; // Impor fungsi uuidv4 untuk menghasilkan UUID unik

const specializations = [
  "Dokter Umum",
  "Dokter Gigi",
  "Dokter Anak",
  "Dokter Bedah",
  "Dokter Jantung",
  "Dokter Kulit",
  "Dokter Mata",
  "Dokter Saraf",
];

const names = [
  "Dr. Ahmad",
  "Dr. Budi",
  "Dr. Clara",
  "Dr. Diana",
  "Dr. Eka",
  "Dr. Faisal",
  "Dr. Gina",
  "Dr. Hana",
];

export const generateDoctors = (count = 10) => {
  const doctors = [];
  for (let i = 0; i < count; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSpecialization =
      specializations[Math.floor(Math.random() * specializations.length)];
    // Gunakan UUID untuk membuat ID unik
    const doctorId = uuidv4();
    doctors.push({
      id: doctorId, // ID berdasarkan UUID
      name: randomName,
      specialization: randomSpecialization,
    });
  }
  return doctors;
};
