export default function StatusFilter() {
  return (
    <section className="p-6">
      <h3 className="font-bold text-lg mb-3">Status Pertandingan</h3>
      <div className="flex gap-4">
        <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm">
          Live
        </span>
        <span className="px-4 py-1 rounded-full bg-gray-200 text-sm cursor-pointer">
          Selesai
        </span>
        <span className="px-4 py-1 rounded-full bg-gray-200 text-sm cursor-pointer">
          Akan Datang
        </span>
      </div>
    </section>
  );
}
