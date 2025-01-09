'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className='min-h-screen'>
      <main className='container mx-auto px-4 max-w-6xl'>
        {/* Hero Section */}
        <section className='py-20 text-center'>
          <h1 className='text-6xl font-bold mb-6'>
            Reserva tu cancha de fútbol
            <span className='text-[#009ee3] block mt-2'>en segundos</span>
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Sistema simple y rápido para reservar canchas deportivas. Sin complicaciones, sin llamadas, todo online.
          </p>
          <Button
            className='bg-[#009ee3] hover:bg-[#008ed0] text-white px-8 py-6 text-lg'
            asChild
          >
            <Link href="/centers">Reservar Ahora</Link>
          </Button>
        </section>

        {/* Características */}
        <section className='py-16 grid md:grid-cols-3 gap-8'>
          <Card className='p-6 text-center'>
            <div className='mb-4'>
              <Image
                src="/window.svg"
                alt="Reserva Online"
                width={48}
                height={48}
                className='mx-auto'
              />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Reserva Online</h3>
            <p className='text-gray-600'>Reserva tu cancha en cualquier momento, desde cualquier dispositivo</p>
          </Card>

          <Card className='p-6 text-center'>
            <div className='mb-4'>
              <Image
                src="/mercadopago-logo.svg"
                alt="Pago Seguro"
                width={48}
                height={48}
                className='mx-auto bg-blue-500 rounded-full'
              />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Pago Seguro</h3>
            <p className='text-gray-600'>Paga de forma segura con MercadoPago</p>
          </Card>

          <Card className='p-6 text-center'>
            <div className='mb-4'>
              <Image
                src="/window.svg"
                alt="Gestión Simple"
                width={48}
                height={48}
                className='mx-auto'
              />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Gestión Simple</h3>
            <p className='text-gray-600'>Administra tus reservas fácilmente desde tu perfil</p>
          </Card>
        </section>

        {/* Tipos de Canchas */}
        <section className='py-16'>
          <h2 className='text-4xl font-bold text-center mb-12'>Tipos de Canchas</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='p-6'>
              <h3 className='text-xl font-semibold mb-4'>Fútbol 5</h3>
              <ul className='space-y-2 text-gray-600'>
                <li>• Césped sintético profesional</li>
                <li>• Medidas reglamentarias</li>
                <li>• Iluminación LED</li>
                <li>• Ideal para partidos rápidos</li>
              </ul>
            </Card>

            <Card className='p-6'>
              <h3 className='text-xl font-semibold mb-4'>Fútbol 7</h3>
              <ul className='space-y-2 text-gray-600'>
                <li>• Mayor espacio de juego</li>
                <li>• Césped de última generación</li>
                <li>• Arcos reglamentarios</li>
                <li>• Perfecta para equipos medianos</li>
              </ul>
            </Card>

            <Card className='p-6'>
              <h3 className='text-xl font-semibold mb-4'>Fútbol 11</h3>
              <ul className='space-y-2 text-gray-600'>
                <li>• Cancha profesional</li>
                <li>• Césped natural o sintético</li>
                <li>• Dimensiones oficiales</li>
                <li>• Ideal para torneos</li>
              </ul>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
