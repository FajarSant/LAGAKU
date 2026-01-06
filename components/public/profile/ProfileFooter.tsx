import { Pengguna } from "@/utils";


interface ProfileFooterProps {
  user: Pengguna | null;
}

export default function ProfileFooter({ user }: ProfileFooterProps) {
  return (
    <footer className="border-t border-gray-800container mx-auto px-4 mt-12 sm: pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">
            © 2025 SportConnect. Data profil Anda dilindungi.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Terakhir diperbarui: {user?.dibuat_pada ? new Date(user.dibuat_pada).toLocaleDateString("id-ID") : "-"}
          </p>
        </div>
      </div>
    </footer>
  );
}