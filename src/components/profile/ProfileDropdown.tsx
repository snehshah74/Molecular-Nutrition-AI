import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  Edit3, 
  ChevronDown
} from 'lucide-react'

interface ProfileDropdownProps {
  userProfile: any
  onLogout: () => void
  onUpdateProfile: (updatedProfile: any) => void
}

export function ProfileDropdown({ userProfile, onLogout, onUpdateProfile }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSave = () => {
    onUpdateProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(userProfile)
    setIsEditing(false)
  }

  const formatLifestyle = (lifestyle: string) => {
    return lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1)
  }

  const getInitials = (profile: any) => {
    if (profile?.sex && profile?.age) {
      return `${profile.sex.charAt(0).toUpperCase()}${profile.age}`
    }
    return 'U'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(userProfile)}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {userProfile?.sex === 'male' ? 'Mr.' : userProfile?.sex === 'female' ? 'Ms.' : ''} ({userProfile?.age}y)
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatLifestyle(userProfile?.lifestyle || 'User')}
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              {/* Profile Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {getInitials(userProfile)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Profile Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {userProfile?.sex === 'male' ? 'Mr.' : userProfile?.sex === 'female' ? 'Ms.' : ''} {userProfile?.age} years old
                  </p>
                </div>
                {!isEditing && (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 className="h-4 w-4" />
                  </motion.button>
                )}
              </div>

              {/* Profile Information */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProfile?.age || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      min="1"
                      max="120"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {userProfile?.age} years old
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sex
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.sex || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, sex: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {userProfile?.sex?.charAt(0).toUpperCase() + userProfile?.sex?.slice(1)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lifestyle
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile?.lifestyle || ''}
                      onChange={(e) => setEditedProfile({...editedProfile, lifestyle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    >
                      <option value="vegan">Vegan</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="omnivore">Omnivore</option>
                      <option value="pescatarian">Pescatarian</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatLifestyle(userProfile?.lifestyle || 'Unknown')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Health Goals
                  </label>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {userProfile?.healthGoals?.length || 0} goals selected
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <motion.button
                      onClick={handleSave}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm py-2 px-3 rounded-md transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    onClick={onLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
