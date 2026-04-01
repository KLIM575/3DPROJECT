export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  color: string
  year: number
  category: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
}

export interface Service {
  title: string
  description: string
  icon: string
}

export interface Testimonial {
  quote: string
  author: string
  company: string
}

export const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Horizon Festival',
    description: 'Immersive WebGL experience for a global music festival featuring real-time audio visualisation and procedural world generation.',
    tags: ['WebGL', '3D', 'Audio', 'Interactive'],
    color: '#9a8f82',
    year: 2025,
    category: 'Experience',
  },
  {
    id: 'project-02',
    title: 'Quantum Interface',
    description: 'Next-generation product configurator with physics-based simulations and real-time material rendering for a luxury tech brand.',
    tags: ['Three.js', 'Physics', 'eCommerce', 'R3F'],
    color: '#7a7d8c',
    year: 2025,
    category: 'Product',
  },
  {
    id: 'project-03',
    title: 'Metropolis',
    description: 'Procedurally generated retrowave city environment for an award-winning game studio landing page with scroll-driven animation.',
    tags: ['Procedural', 'Scroll', 'GLSL', 'Shaders'],
    color: '#8b6f6f',
    year: 2024,
    category: 'Creative',
  },
  {
    id: 'project-04',
    title: 'Data Nebula',
    description: 'Real-time data visualisation dashboard turning complex financial data into beautiful 3D particle constellations.',
    tags: ['Data Viz', 'Particles', 'WebSocket', 'Finance'],
    color: '#6b7a8c',
    year: 2024,
    category: 'Data',
  },
  {
    id: 'project-05',
    title: 'Echo Chamber',
    description: 'Spatial audio experiment combining binaural sound design with reactive 3D environments for a leading streaming platform.',
    tags: ['WebAudio', '3D', 'Spatial', 'Experiment'],
    color: '#7d8b7a',
    year: 2024,
    category: 'Experiment',
  },
  {
    id: 'project-06',
    title: 'Fractal Identity',
    description: 'Dynamic brand identity system generating unique fractal signatures per user interaction for a decentralized art collective.',
    tags: ['Generative', 'Identity', 'NFT', 'Art'],
    color: '#9a8060',
    year: 2023,
    category: 'Identity',
  },
  {
    id: 'project-07',
    title: 'Void Runner',
    description: 'Infinite runner browser game with fully procedural environments and a custom physics engine built entirely in WebAssembly.',
    tags: ['Game', 'WASM', 'Procedural', 'WebGL'],
    color: '#756d82',
    year: 2023,
    category: 'Game',
  },
  {
    id: 'project-08',
    title: 'Stellar Archive',
    description: 'Interactive scientific visualisation of 100,000 stars using instanced rendering and real astronomical data from NASA APIs.',
    tags: ['Science', 'Instancing', 'NASA', 'Big Data'],
    color: '#a89872',
    year: 2023,
    category: 'Science',
  },
]

export const teamMembers: TeamMember[] = [
  {
    name: 'Alex Mora',
    role: 'Creative Director',
    bio: 'Blending art and code since 2010. Obsessed with finding the edges of what browsers can render.',
  },
  {
    name: 'Sasha Kim',
    role: 'Lead Engineer',
    bio: 'GLSL poet and WebGL architect. If it involves shaders, it involves Sasha.',
  },
  {
    name: 'Lena Sorel',
    role: 'Motion Designer',
    bio: 'Turning scroll events into cinematic journeys. Every frame is intentional.',
  },
  {
    name: 'Dmitri Volkov',
    role: 'Technical Artist',
    bio: 'Lives at the intersection of Blender and the browser. Builder of impossible things.',
  },
]

export const services: Service[] = [
  {
    title: 'Immersive Experiences',
    description: 'Full-screen WebGL worlds that blur the line between website and game engine.',
    icon: '◈',
  },
  {
    title: 'Creative Development',
    description: 'Award-winning interactive campaigns built with bleeding-edge browser technology.',
    icon: '⬡',
  },
  {
    title: '3D & Motion',
    description: 'Real-time 3D graphics, procedural animation, and scroll-driven storytelling.',
    icon: '◎',
  },
  {
    title: 'Performance Engineering',
    description: 'GPU-optimised rendering pipelines that deliver 60fps on any device.',
    icon: '⟁',
  },
  {
    title: 'Generative Design',
    description: 'Algorithmic visual systems that create unique, never-repeating brand expressions.',
    icon: '⬢',
  },
  {
    title: 'R&D Prototyping',
    description: 'Rapid exploration of emerging web technologies — WebGPU, WASM, spatial audio.',
    icon: '◇',
  },
]

export const testimonials: Testimonial[] = [
  {
    quote: 'They built something we genuinely didn\'t think was possible in a browser. The result won us three industry awards.',
    author: 'Maya Chen',
    company: 'Apex Creative Studios',
  },
  {
    quote: 'The scroll experience they designed turned our product launch into a conversation piece. Engagement was up 340%.',
    author: 'Jordan Park',
    company: 'Luminary Brands',
  },
  {
    quote: 'Pure technical artistry. They understand that performance and beauty are not opposites — they\'re the same goal.',
    author: 'Rafael Osei',
    company: 'Meridian Digital',
  },
  {
    quote: 'Working with this team felt like the future arrived early. Every interaction on the final site felt like magic.',
    author: 'Irina Volkov',
    company: 'Nova Labs',
  },
]
