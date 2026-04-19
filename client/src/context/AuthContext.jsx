import { createContext, useState } from 'react'
import API from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  )

  const mergeUserState = (updates) => {
    const mergedUser = {
      ...(user || {}),
      ...updates,
      token: user?.token || localStorage.getItem('token'),
    }

    setUser(mergedUser)
    localStorage.setItem('user', JSON.stringify(mergedUser))
    return mergedUser
  }

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/users/login', { email, password })
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('token', data.token)
      return data
    } catch (err) {
      console.log('Full error:', err)
      console.log('Response:', err.response)
      throw err
    }
  }

  const register = async (name, email, password, gender) => {
    try {
      const { data } = await API.post('/users/register', { name, email, password, gender })
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      localStorage.setItem('token', data.token)
      return data
    } catch (err) {
      console.log('Full error:', err)
      console.log('Response:', err.response)
      throw err
    }
  }

  const refreshProfile = async () => {
    const { data } = await API.get('/users/profile')
    return mergeUserState(data)
  }

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/users/profile', profileData)
    return mergeUserState(data)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, refreshProfile, updateProfile, mergeUserState, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
