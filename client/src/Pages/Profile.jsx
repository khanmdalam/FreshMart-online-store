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
  const { user, refreshProfile, updateProfile, mergeUserState } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [gender, setGender] = useState(user?.gender || 'male')
  const [avatar, setAvatar] = useState(user?.avatar || '')
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
        setGender(profile?.gender || 'male')
        setAvatar(profile?.avatar || '')
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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('Please choose an image smaller than 4MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const nextAvatar = typeof reader.result === 'string' ? reader.result : ''
      setError('')
      setAvatar(nextAvatar)
      mergeUserState({ avatar: nextAvatar })
    }
    reader.readAsDataURL(file)
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
        gender,
        avatar,
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
            <label className="text-sm text-gray-600 mb-3 block">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center text-3xl">
                {avatar ? (
                  <img src={avatar} alt={name || 'Profile'} className="h-full w-full object-cover" />
                ) : (
                  <span>{gender === 'female' ? '👩‍🦰' : '🧑'}</span>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-green-400 hover:text-green-600 cursor-pointer">
                  Choose from Gallery
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar('')
                      mergeUserState({ avatar: '' })
                    }}
                    className="block text-sm text-red-400 hover:text-red-600"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

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
            <label className="text-sm text-gray-600 mb-1 block">Gender</label>
            <select
              value={gender}
              onChange={(e) => {
                const nextGender = e.target.value
                setGender(nextGender)
                mergeUserState({ gender: nextGender })
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
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
