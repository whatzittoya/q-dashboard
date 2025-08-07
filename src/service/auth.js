import { useMainStore } from '@/stores/main'
import axios from 'axios'

export async function login(email, password) {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login-back`, {
      email: email,
      password: password,
    })

    const token = response.data.api_key
const role=response.data.role
    // Store the token in local storage
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    localStorage.setItem('role', role)

  
    return { success: true, token: token,role:role }
  } catch (error) {
    console.error('Login failed', error)
    return { success: false, error: error.message }
  }
}

export async function logout() {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout-back`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    await useMainStore().setUser()
    useMainStore().resetQuinosData()

    return { success: true, message: response.data.message }
  } catch (error) {
    console.error('Logout failed', error)
    return { success: false, error: error.message }
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')
  // Add any additional checks you may need (e.g., token expiration)

  return !!token && !!email // Returns true if the token is present, false otherwise
}

export function getRole() {
  const role = localStorage.getItem('role')
  return role
}
export const resetPassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('token')

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/reset-pass`,
      {
        old_password: oldPassword,
        new_password: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return { success: true, message: response.data.message }
  } catch (error) {
    console.error('Password reset failed', error)
    return { success: false, message: error.response.data.message || 'Password reset failed' }
  }
}
