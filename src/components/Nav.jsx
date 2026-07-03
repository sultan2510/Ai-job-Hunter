import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">AI</span>
          Job Hunter
        </Link>
        {!isHome && (
          <Link to="/" className="back-link">← All tools</Link>
        )}
      </div>
    </div>
  )
}
