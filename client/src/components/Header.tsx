import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-3 bg-white text-black">
      <nav className="max-w-7xl mx-auto flex items-center gap-6">
        <div className="font-bold"><Link to="/">Home</Link></div>
      </nav>
    </header>
  )
}
