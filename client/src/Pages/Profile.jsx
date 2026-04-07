import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const emptyAddress = {
  street: '',
  city: '',
  state: '',
  pincode: '',
}

function Profile() {
  const { user, refreshProfile, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [address, setAddress] = useState(user?.address || emptyAddress)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoadingProfile(false)
        return
      }

      try {
        const profile = await refreshProfile()
        setName(profile?.name || '')
        setAddress({
          street: profile?.address?.street || '',
          city: profile?.address?.city || '',
          state: profile?.address?.state || '',
          pincode: profile?.address?.pincode || '',
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile')
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setSaving(true)
    try {
      await updateProfile({
        name: name.trim(),
        address,
      })
      setSuccess('Profile updated successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-500 text-sm mb-6">View and edit your name and delivery address.</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Raja Kesharwani"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Street Address</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              placeholder="123 Main Street"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="Mumbai"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="Maharashtra"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={address.pincode}
              onChange={handleAddressChange}
              placeholder="400001"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
