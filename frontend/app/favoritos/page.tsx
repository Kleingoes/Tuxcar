// app/favoritos/page.tsx
import Navbar from '@/components/navbar';

export default function FavoritosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-5xl mb-4">❤️</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mis favoritos</h1>
        <p className="text-gray-500 dark:text-gray-400">Próximamente podrás guardar tus vehículos favoritos aquí.</p>
        <a href="/vehiculos" className="mt-4 inline-block text-sm underline text-gray-500">Ver catálogo</a>
      </main>
    </div>
  );
}
