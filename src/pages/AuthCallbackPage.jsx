import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { auth } from '../services/auth'

function AuthCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { completeLogin } = useAuth()
  const { t } = useTranslation()

  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const refreshToken = params.get('refresh_token')
    const error = params.get('error')

    if (error) {
      setStatus('error')
      setErrorMessage(error)
      return
    }

    if (!token) {
      setStatus('error')
      setErrorMessage(t('auth.missingToken', 'No authentication token received'))
      return
    }

    completeLogin({ accessToken: token, refreshToken })
      .then(() => {
        setStatus('success')

        // Get redirect path and navigate
        const redirectTarget = auth.getAndClearRedirectPath()
        
        setTimeout(() => {
          navigate(redirectTarget, { replace: true })
        }, 750)
      })
      .catch((err) => {
        setStatus('error')
        setErrorMessage(err.message || t('auth.loginFailed', 'Login failed'))
      })
  }, [completeLogin, location.search, navigate, t])

  const renderIcon = () => {
    if (status === 'loading') {
      return <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
    }
    if (status === 'success') {
      return <ShieldCheck className="w-10 h-10 text-green-500" />
    }
    return <ShieldAlert className="w-10 h-10 text-red-500" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-red-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 text-center">
        <div className="flex justify-center mb-6">{renderIcon()}</div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {status === 'error' 
            ? t('auth.errorTitle', 'Authentication Failed')
            : status === 'success'
            ? t('auth.successTitle', 'Welcome!')
            : t('auth.loadingTitle', 'Signing you in...')
          }
        </h1>
        
        <p className="text-gray-600 mb-8">
          {status === 'error' 
            ? errorMessage
            : status === 'success'
            ? t('auth.successMessage', 'You have been successfully authenticated. Redirecting...')
            : t('auth.loadingMessage', 'Please wait while we complete your authentication.')
          }
        </p>

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => auth.login('/')}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {t('auth.tryAgain', 'Try Again')}
            </button>
            <button
              onClick={() => navigate('/', { replace: true })}
              className="w-full py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('auth.goHome', 'Go to Homepage')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallbackPage
