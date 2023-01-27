import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import moment from 'moment'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function getStaticProps() {
  const { data } = await supabaseAdmin
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })
  return {
    props: {
      images: data,
    },
    revalidate: 2,
  }
}

export default function Gallery({ images }) {
  return (
    <div className='max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
        {images.map(image => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}

function BlurImage({ image }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <a href={image.href} className='group'>
      <div className=''>
        <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative'>
          <Image
            alt=''
            src={image.imageSrc}
            fill
            sizes='(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw'
            // objectFit='cover'
            priority
            style={{ objectFit: 'cover' }}
            className={`group-hover:opacity-75 duration-700 ease-in-out ${
              isLoading
                ? 'grayscale blur-2xl scale-110'
                : 'grayscale-0 blur-0 scale-100'
            }`}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
        <h3 className='mt-4 text-sm text-gray-700'>{image.name}</h3>
        <p>{moment(image.created_at).fromNow()}</p>
        <p className='mt-1 text-lg font-medium text-gray-900'>
          {image.userName}
        </p>
      </div>
    </a>
  )
}
