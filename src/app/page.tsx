'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className=''>
      <main className='container mx-auto px-4 max-w-6xl'>
        {/* Hero Section */}
        <section className='py-20 text-center'>
          <h1 className='text-6xl font-bold mb-6'>
            La forma más fácil de jugar al
            <span className='text-[#009ee3] block mt-2'>Fútbol</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Reservá las mejores canchas de fútbol al instante.
          </p>
          <div className='flex gap-4 justify-center'>
            <Button
              className='bg-[#009ee3] hover:bg-[#008ed0] text-white px-8 py-6 text-lg'
              asChild
            >
              <Link href="/1">Reservar Cancha</Link>
            </Button>
            <Button
              variant="outline"
              className='px-8 py-6 text-lg'
              asChild
            >
              <Link href="/precios">Ver Precios</Link>
            </Button>
          </div>
        </section>

      </main >
    </div >
  )
}
