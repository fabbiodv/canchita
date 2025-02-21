'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <main className='container mx-auto px-4 max-w-6xl'>
        {/* Hero Section */}
        <section className='py-12 md:py-20 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4 md:mb-6'>
            La forma más fácil de jugar al
            <span className='text-[#009ee3] block mt-2'>Fútbol</span>
          </h1>
          <p className='text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4'>
            Reservá las mejores canchas de fútbol al instante.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center px-4'>
            <Button
              className='bg-[#009ee3] hover:bg-[#008ed0] text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto'
              asChild
            >
              <Link href="/1">Reservar Cancha</Link>
            </Button>
            <Button
              variant="outline"
              className='px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto'
              asChild
            >
              <Link href="/admin/centers">Alquila tu cancha</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
