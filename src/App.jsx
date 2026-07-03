import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import ToolRunner from './pages/ToolRunner.jsx'
import { tools } from './tools.js'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        {tools.map((tool) => (
          <Route key={tool.id} path={tool.path} element={<ToolRunner tool={tool} />} />
        ))}
      </Routes>
      <div className="footer">Built with AI Job Hunter · No data is stored</div>
    </>
  )
}
