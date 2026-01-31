import { Routes, Route, useLocation } from 'react-router-dom'
import { Header, Navigation, Footer } from './components/layout'
import { HomePage, AuthCallbackPage, NewsPage, WeatherPage, JobsPage, EducationPage, NotFoundPage } from './pages/index.jsx'
import { HomePageSkeleton } from './components/common'
import { useAuth } from './context/AuthContext'
import { AUTH_CALLBACK_PATH } from './utils/constants'

function App() {
  const location = useLocation()
  const { isLoading } = useAuth()
  
  // Don't show header/nav/footer on auth callback page
  const isAuthCallback = location.pathname === AUTH_CALLBACK_PATH
  
  if (isAuthCallback) {
    return (
      <Routes>
        <Route path={AUTH_CALLBACK_PATH} element={<AuthCallbackPage />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex flex-col">
      <Header />
      <Navigation />
      
      <div className="flex-1">
        {isLoading && location.pathname === '/' ? (
          <HomePageSkeleton />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/education" element={<EducationPage />} />
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default App
