import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BugProvider } from './context/BugContext'
import Navbar from './components/Navbar'
import BugList from './pages/BugList'
import BugDetail from './pages/BugDetail'
import NewBug from './pages/NewBug'
import EditBug from './pages/EditBug'

export default function App() {
  return (
    <BugProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Redirect root to /bugs */}
          <Route path="/" element={<Navigate to="/bugs" replace />} />
          <Route path="/bugs" element={<BugList />} />
          <Route path="/bugs/new" element={<NewBug />} />
          <Route path="/bugs/:id" element={<BugDetail />} />
          <Route path="/bugs/:id/edit" element={<EditBug />} />
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/bugs" replace />} />
        </Routes>
      </BrowserRouter>
    </BugProvider>
  )
}
