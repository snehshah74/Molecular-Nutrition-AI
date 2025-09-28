import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  LogOut, 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Heart,
  Target
} from 'lucide-react'

interface ProfileSectionProps {
  userProfile: any
  onLogout: () => void
  onUpdateProfile: (updatedProfile: any) => void
}

export function ProfileSection({ userProfile, onLogout, onUpdateProfile }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)

  const handleSave = () => {
    onUpdateProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(userProfile)
    setIsEditing(false)
  }

  const formatHealthGoals = (goals: string[]) => {
    return goals.map(goal => {
      const formatted = goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      return formatted
    }).join(', ')
  }

  const formatLifestyle = (lifestyle: string) => {
    return lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Profile Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your personal information
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <motion.button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
              <motion.button
                onClick={onLogout}
                className="btn-danger flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary-600" />
            Basic Information
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({...editedProfile, age: parseInt(e.target.value)})}
                  className="input w-full"
                  min="1"
                  max="120"
                />
              ) : (
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {userProfile.age} years old
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sex
              </label>
              {isEditing ? (
                <select
                  value={editedProfile.sex}
                  onChange={(e) => setEditedProfile({...editedProfile, sex: e.target.value})}
                  className="input w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  {userProfile.sex.charAt(0).toUpperCase() + userProfile.sex.slice(1)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ethnicity
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.ethnicity}
                  onChange={(e) => setEditedProfile({...editedProfile, ethnicity: e.target.value})}
                  className="input w-full"
                />
              ) : (
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {userProfile.ethnicity}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.region}
                  onChange={(e) => setEditedProfile({...editedProfile, region: e.target.value})}
                  className="input w-full"
                />
              ) : (
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {userProfile.region}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health & Lifestyle */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary-600" />
            Health & Lifestyle
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lifestyle
              </label>
              {isEditing ? (
                <select
                  value={editedProfile.lifestyle}
                  onChange={(e) => setEditedProfile({...editedProfile, lifestyle: e.target.value})}
                  className="input w-full"
                >
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              ) : (
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <Heart className="h-4 w-4 mr-2 text-gray-400" />
                  {formatLifestyle(userProfile.lifestyle)}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Health Goals
              </label>
              <div className="flex items-center text-gray-900 dark:text-gray-100">
                <Target className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">{formatHealthGoals(userProfile.healthGoals)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medical History
              </label>
              <div className="flex items-center text-gray-900 dark:text-gray-100">
                <Heart className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">
                  {userProfile.medicalHistory && userProfile.medicalHistory.length > 0 
                    ? userProfile.medicalHistory.join(', ')
                    : 'None reported'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Profile Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {userProfile.age}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years Old</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {userProfile.healthGoals?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Health Goals</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatLifestyle(userProfile.lifestyle)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lifestyle</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {userProfile.region}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Region</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
