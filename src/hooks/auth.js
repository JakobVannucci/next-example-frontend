import useSWR, { useSWRConfig } from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter()

  const { mutate } = useSWRConfig()

  const { data: user, error } = useSWR('/api/user', () =>
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status != 409) throw error

        router.push('/verify-email')
      }),
  )

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const register = async ({ setErrors, ...props }) => {
    await csrf()

    setErrors([])

    axios
      .post('/register', props)
      .then(() => mutate('/api/user'))
      .catch(error => {
        if (error.response.status != 422) throw error

        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setStatus(null)
    setErrors([])

    axios
      .post('/login', props)
      .then(() => mutate('/api/user'))
      .catch(error => {
        if (error.response.status != 422) throw error

        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf()

    setStatus(null)
    setErrors([])

    axios
      .post('/forgot-password', { email })
      .then(response => setStatus(response.data.status))
      .catch(error => {
        if (error.response.status != 422) throw error

        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf()

    setStatus(null)
    setErrors([])

    axios
      .post('/reset-password', { token: router.query.token, ...props })
      .then(response =>
        router.push('/login?reset=' + btoa(response.data.status)),
      )
      .catch(error => {
        if (error.response.status != 422) throw error

        setErrors(Object.values(error.response.data.errors).flat())
      })
  }

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post('/email/verification-notification')
      .then(response => setStatus(response.data.status))
  }

  const logout = async () => {
    if (!error) {
      await axios.post('/logout')

      mutate('/api/user')
    }

    window.location.pathname = '/login'
  }

  useEffect(() => {
    if (middleware == 'guest' && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated)
    if (middleware == 'auth' && error) logout()
  }, [user, error])

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  }
}
