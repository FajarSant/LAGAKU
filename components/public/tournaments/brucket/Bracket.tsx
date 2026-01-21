"use client";

import { useState, useEffect, ReactElement } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Trophy, Loader2, ZoomIn, ZoomOut, Maximize2, Minus, Plus } from 'lucide-react';

interface Tim {
  id: string;
  nama: string;
  jurusan: string | null;
  status: 'aktif' | 'gugur';
}

interface Pertandingan {
  id: string;
  round_id: string;
  tim_a_id: string;
  tim_b_id: string | null;
  skor_tim_a: number | null;
  skor_tim_b: number | null;
  pemenang_id: string | null;
  status: 'dijadwalkan' | 'berlangsung' | 'selesai';
  round?: {
    id: string;
    nama: string;
    urutan: number;
  };
  tim_a?: Tim;
  tim_b?: Tim;
}

interface PertandinganDenganPosisi extends Pertandingan {
  position: {
    x: number;
    y: number;
  };
}

interface Babak {
  id: string;
  nama: string;
  urutan: number;
  pertandingan: PertandinganDenganPosisi[];
}

interface BracketViewProps {
  eventId: string;
}

export default function BracketView({ eventId }: BracketViewProps) {
  const supabase = createClient();
  const [pertandingan, setPertandingan] = useState<Pertandingan[]>([]);
  const [tim, setTim] = useState<Tim[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    ambilDataBracket();
  }, [eventId]);

  const ambilDataBracket = async () => {
    try {
      setLoading(true);

      const [dataTim, dataPertandingan] = await Promise.all([
        supabase
          .from('tim')
          .select('*')
          .eq('acara_id', eventId)
          .order('nama'),
        supabase
          .from('pertandingan')
          .select(`
            *,
            round:round_id(id, nama, urutan),
            tim_a:tim_a_id(id, nama, jurusan, status),
            tim_b:tim_b_id(id, nama, jurusan, status)
          `)
          .eq('acara_id', eventId)
          .order('round_id', { ascending: true })
      ]);

      if (dataTim.data) setTim(dataTim.data);
      if (dataPertandingan.data) setPertandingan(dataPertandingan.data as Pertandingan[]);
    } catch (error) {
      console.error('Error mengambil data bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  const buatStrukturBracket = (): Babak[] => {
    // Kelompokkan pertandingan berdasarkan babak
    const babakMap = new Map<string, Babak>();
    
    pertandingan.forEach(pertandingan => {
      if (!babakMap.has(pertandingan.round_id)) {
        babakMap.set(pertandingan.round_id, {
          id: pertandingan.round_id,
          nama: pertandingan.round?.nama || `Babak ${pertandingan.round?.urutan || '1'}`,
          urutan: pertandingan.round?.urutan || 1,
          pertandingan: []
        });
      }
      const babak = babakMap.get(pertandingan.round_id);
      if (babak) {
        babak.pertandingan.push({
          ...pertandingan,
          position: { x: 0, y: 0 } // Akan dihitung di bawah
        });
      }
    });

    // Konversi ke array dan urutkan berdasarkan urutan
    const babak = Array.from(babakMap.values()).sort((a, b) => a.urutan - b.urutan);
    
    // Hitung posisi untuk setiap pertandingan
    const babakDenganPosisi = babak.map((babak, indexBabak) => {
      const pertandinganDiurutkan = babak.pertandingan.sort((a, b) => a.id.localeCompare(b.id));
      const pertandinganDenganPosisi = pertandinganDiurutkan.map((pertandingan, indexPertandingan: number) => {
        const position = {
          x: indexBabak * 320, // Posisi horizontal berdasarkan babak
          y: indexPertandingan * 160 + (Math.pow(2, indexBabak) - 1) * 40 // Posisi vertikal dengan spasi
        };
        return { ...pertandingan, position };
      });
      return { ...babak, pertandingan: pertandinganDenganPosisi };
    });

    return babakDenganPosisi;
  };

  const tampilkanNodePertandingan = (pertandingan: PertandinganDenganPosisi) => {
    const timA = pertandingan.tim_a;
    const timB = pertandingan.tim_b;
    
    const sudahSelesai = pertandingan.status === 'selesai';
    const sedangBerlangsung = pertandingan.status === 'berlangsung';
    const timAMenang = pertandingan.pemenang_id === pertandingan.tim_a_id;
    const timBMenang = pertandingan.pemenang_id === pertandingan.tim_b_id;

    return (
      <div
        className="absolute"
        key={pertandingan.id}
        style={{
          left: `${pertandingan.position.x}px`,
          top: `${pertandingan.position.y}px`,
          width: '280px',
          zIndex: 10
        }}
      >
        <div className={`
          bg-white dark:bg-gray-800
          border ${sudahSelesai ? 'border-emerald-300 dark:border-emerald-700' :
            sedangBerlangsung ? 'border-amber-300 dark:border-amber-700' :
            'border-gray-200 dark:border-gray-700'}
          rounded-lg shadow-lg
          overflow-hidden
          transition-all duration-200 hover:shadow-xl hover:-translate-y-1
        `}>
          {/* Header pertandingan dengan status */}
          <div className={`
            px-4 py-2
            ${sudahSelesai ? 'bg-emerald-500 dark:bg-emerald-600' :
              sedangBerlangsung ? 'bg-amber-500 dark:bg-amber-600' :
              'bg-blue-500 dark:bg-blue-600'}
            flex justify-between items-center
          `}>
            <span className="text-sm font-medium text-white">
              {pertandingan.round?.nama}
            </span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
              {sudahSelesai ? '✓' : sedangBerlangsung ? '⚡' : '⏱️'}
            </span>
          </div>

          {/* Tim-tim */}
          <div className="p-4">
            {/* Tim A */}
            <div className={`
              flex justify-between items-center p-3 rounded-lg mb-2
              ${timAMenang ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}
              transition-colors duration-150
            `}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg"></div>
                  {timAMenang && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate">
                    {timA?.nama || 'TBD'}
                  </div>
                  {timA?.jurusan && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {timA.jurusan}
                    </div>
                  )}
                </div>
              </div>
              <div className={`
                text-2xl font-bold min-w-[2.5rem] text-right
                ${timAMenang ? 'text-emerald-600 dark:text-emerald-400 font-black' :
                  timBMenang ? 'text-gray-400 dark:text-gray-500' :
                  'text-gray-900 dark:text-white'}
              `}>
                {pertandingan.skor_tim_a !== null ? pertandingan.skor_tim_a : '-'}
              </div>
            </div>

            {/* Pembatas */}
            <div className="flex items-center justify-center my-2">
              <div className="w-6 h-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="mx-2 text-xs text-gray-400">VS</div>
              <div className="w-6 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Tim B */}
            <div className={`
              flex justify-between items-center p-3 rounded-lg
              ${timBMenang ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}
              transition-colors duration-150
            `}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg"></div>
                  {timBMenang && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate">
                    {timB?.nama || (pertandingan.tim_b_id ? 'TBD' : 'BYE')}
                  </div>
                  {timB?.jurusan && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {timB.jurusan}
                    </div>
                  )}
                </div>
              </div>
              <div className={`
                text-2xl font-bold min-w-[2.5rem] text-right
                ${timBMenang ? 'text-emerald-600 dark:text-emerald-400 font-black' :
                  timAMenang ? 'text-gray-400 dark:text-gray-500' :
                  'text-gray-900 dark:text-white'}
              `}>
                {pertandingan.tim_b_id ? (pertandingan.skor_tim_b !== null ? pertandingan.skor_tim_b : '-') : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tampilkanKonektor = (babak: Babak[]): ReactElement[] => {
    const konektor: ReactElement[] = [];

    for (let indexBabak = 0; indexBabak < babak.length - 1; indexBabak++) {
      const babakSekarang = babak[indexBabak];
      const babakBerikutnya = babak[indexBabak + 1];

      babakSekarang.pertandingan.forEach((pertandingan, indexPertandingan: number) => {
        const indexPertandinganBerikutnya = Math.floor(indexPertandingan / 2);
        const pertandinganBerikutnya = babakBerikutnya.pertandingan[indexPertandinganBerikutnya];
        if (!pertandinganBerikutnya) return;

        // Hitung posisi konektor
        const startX = pertandingan.position.x + 280; // Akhir dari pertandingan sekarang
        const startY = pertandingan.position.y + 60; // Tengah dari pertandingan sekarang
        const endX = pertandinganBerikutnya.position.x; // Awal dari pertandingan berikutnya
        const endY = pertandinganBerikutnya.position.y + 60; // Tengah dari pertandingan berikutnya

        konektor.push(
          <g key={`konektor-${pertandingan.id}-${pertandinganBerikutnya.id}`}>
            {/* Garis horizontal dari pertandingan sekarang */}
            <line
              x1={startX}
              y1={startY}
              x2={startX + 20}
              y2={startY}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Konektor vertikal */}
            <line
              x1={startX + 20}
              y1={startY}
              x2={startX + 20}
              y2={endY}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Garis horizontal ke pertandingan berikutnya */}
            <line
              x1={startX + 20}
              y1={endY}
              x2={endX}
              y2={endY}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Kepala panah */}
            <polygon
              points={`${endX-5},${endY-5} ${endX},${endY} ${endX-5},${endY+5}`}
              fill="#94a3b8"
            />
          </g>
        );
      });
    }

    return konektor;
  };

  const dapatkanInfoUkuranTurnamen = (jumlahBabak: number) => {
    switch (jumlahBabak) {
      case 5:
        return { ukuran: 32, babak: ['32 Besar', '16 Besar', 'Perempat Final', 'Semi Final', 'Final'] };
      case 4:
        return { ukuran: 16, babak: ['16 Besar', 'Perempat Final', 'Semi Final', 'Final'] };
      case 3:
        return { ukuran: 8, babak: ['Perempat Final', 'Semi Final', 'Final'] };
      default:
        return { ukuran: tim.length, babak: [] };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Menyiapkan bracket...</p>
        </div>
      </div>
    );
  }

  if (pertandingan.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Belum ada pertandingan
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Turnamen belum memiliki jadwal pertandingan
        </p>
      </div>
    );
  }

  const babak = buatStrukturBracket();
  const maxX = Math.max(...babak.flatMap(b => b.pertandingan.map(p => p.position.x))) + 300;
  const maxY = Math.max(...babak.flatMap(b => b.pertandingan.map(p => p.position.y))) + 120;
  const infoTurnamen = dapatkanInfoUkuranTurnamen(babak.length);

  return (
    <div className="relative">
      {/* Kontrol zoom */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg">
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          disabled={zoom <= 0.5}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium w-16 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          disabled={zoom >= 2}
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          onClick={() => setZoom(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Info bracket */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Bracket Turnamen
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {infoTurnamen.ukuran > 0 ? infoTurnamen.ukuran : tim.length} Tim • {babak.length} Babak • {pertandingan.length} Pertandingan
              </p>
              {infoTurnamen.ukuran > 0 && (
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    {infoTurnamen.ukuran} Besar
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded"></div>
              <span className="text-sm">Tim A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded"></div>
              <span className="text-sm">Tim B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Label babak */}
      {infoTurnamen.babak.length > 0 && (
        <div className="flex justify-center gap-8 mb-4 overflow-x-auto pb-2">
          {infoTurnamen.babak.map((namaBabak, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[120px]"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg w-full text-center">
                <div className="text-sm font-bold">{namaBabak}</div>
                <div className="text-xs opacity-90">
                  {babak[index]?.pertandingan.length || 0} Pertandingan
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Babak {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Container bracket */}
      <div className="relative bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-900/30 dark:to-gray-900/10 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 overflow-hidden">
        <div className="overflow-auto">
          <div 
            className="relative min-w-full min-h-[600px]"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            {/* SVG untuk konektor */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={maxX}
              height={maxY}
            >
              {tampilkanKonektor(babak)}
            </svg>

            {/* Node pertandingan */}
            <div className="relative">
              {babak.flatMap(babak => 
                babak.pertandingan.map((pertandingan) => tampilkanNodePertandingan(pertandingan))
              )}
            </div>

            {/* Label babak fallback jika ukuran turnamen tidak standar */}
            {infoTurnamen.babak.length === 0 && (
              babak.map((babak, index) => (
                <div
                  key={`label-${babak.id}`}
                  className="absolute top-0"
                  style={{
                    left: `${index * 320 + 140}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="text-sm font-bold">{babak.nama}</div>
                    <div className="text-xs opacity-90">{babak.pertandingan.length} Pertandingan</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Petunjuk scroll */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            Scroll untuk melihat bracket lengkap
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded"></div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">Tim A</div>
              <div className="text-sm text-gray-500">Posisi kiri, warna biru</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded"></div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">Tim B</div>
              <div className="text-sm text-gray-500">Posisi kanan, warna ungu</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-4 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <div className="font-bold text-emerald-800 dark:text-emerald-300">Pemenang</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-400">Titik hijau menandakan pemenang</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg"></div>
            <div>
              <div className="font-bold text-amber-800 dark:text-amber-300">Live</div>
              <div className="text-sm text-amber-700 dark:text-amber-400">Sedang berlangsung</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}