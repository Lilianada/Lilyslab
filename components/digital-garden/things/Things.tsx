import React from 'react'


interface ThingsILike {
  id: string
  name: string
  description: string
  image: string
}

interface ThingsIDontLike {
  id: string
  name: string
  description: string
  image: string
}



export default function Things() {
  const thingsILike = [
    {
      id: '1',
      name: 'Coding',
      description: 'I love coding and building things with code.',
      image: '/coding.png'
    },
    {
      id: '2',
      name: 'Reading',
      description: 'I love reading and learning new things.',
      image: '/reading.png'
    },
    {
      id: '3',
      name: 'Writing',
      description: 'I love writing and sharing my thoughts.',
      image: '/writing.png'
    },
    {
      id: '3',
      name: 'Writing',
      description: 'I love writing and sharing my thoughts.',
      image: '/writing.png'
    }
  ]
  const thingsIDontLike = [
    {
      id: '1',
      name: 'Coding',
      description: 'I love coding and building things with code.',
      image: '/coding.png'
    }
  ]
  return (
    <section className='space-y-4 max-w-5xl mx-auto'>
      <h2 className="text-2xl font-bold">Things I Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {thingsILike.map((thing) => (
          <div key={thing.id} className="bg-card p-4 rounded-md">
            <h3 className="text-lg font-medium">{thing.name}</h3>
            <p className="text-sm text-muted-foreground">{thing.description}</p>
          </div>
        ))}
        </div>
      
    </section>
  )
}
