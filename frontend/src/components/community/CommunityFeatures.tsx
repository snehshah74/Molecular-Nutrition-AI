import { useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  ThumbsUp, 
  Bookmark,
  MoreHorizontal,
  Search,
  Award,
  Target,
  Brain,
  Shield,
  Activity,
  Plus,
  Hash,
  Eye,
  MessageSquare,
  CheckCircle
} from 'lucide-react'
import type { UserProfile } from '@/types'
import { cn } from '@/lib/utils'

interface CommunityFeaturesProps {
  userProfile: UserProfile | null
  onJoinCommunity?: (communityId: string) => void
  onLeaveCommunity?: (communityId: string) => void
}


export const CommunityFeatures = memo(function CommunityFeatures({ 
  userProfile,
  onJoinCommunity,
  onLeaveCommunity
}: CommunityFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'communities' | 'challenges' | 'leaderboard'>('feed')
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [, setShowCreatePost] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Mock communities data
  const communities = useMemo(() => [
    {
      id: 'molecular-nutrition',
      name: 'Molecular Nutrition Enthusiasts',
      description: 'Discuss the science behind molecular nutrition, share research, and learn from experts.',
      memberCount: 12450,
      category: 'science' as const,
      isJoined: true,
      isPrivate: false,
      tags: ['nutrition', 'science', 'research', 'molecular'],
      createdBy: 'Dr. Sarah Chen',
      createdAt: new Date('2023-01-15'),
      lastActivity: new Date(),
      rules: ['Be respectful', 'Share evidence-based content', 'No spam'],
      moderators: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez']
    },
    {
      id: 'vegan-molecular',
      name: 'Vegan Molecular Nutrition',
      description: 'Plant-based molecular nutrition for optimal health and performance.',
      memberCount: 8920,
      category: 'nutrition' as const,
      isJoined: true,
      isPrivate: false,
      tags: ['vegan', 'plant-based', 'nutrition', 'molecular'],
      createdBy: 'Alex Thompson',
      createdAt: new Date('2023-03-10'),
      lastActivity: new Date(),
      rules: ['Plant-based only', 'Be supportive', 'Share recipes'],
      moderators: ['Alex Thompson', 'Dr. Lisa Park']
    },
    {
      id: 'fitness-nutrition',
      name: 'Fitness & Molecular Nutrition',
      description: 'Optimizing nutrition for athletic performance and muscle building.',
      memberCount: 15680,
      category: 'fitness' as const,
      isJoined: false,
      isPrivate: false,
      tags: ['fitness', 'athletics', 'muscle-building', 'performance'],
      createdBy: 'Coach Marcus',
      createdAt: new Date('2023-02-20'),
      lastActivity: new Date(),
      rules: ['Stay on topic', 'Share experiences', 'Be encouraging'],
      moderators: ['Coach Marcus', 'Dr. Jennifer Liu']
    },
    {
      id: 'wellness-journey',
      name: 'Wellness Journey',
      description: 'Holistic approach to health, wellness, and molecular nutrition.',
      memberCount: 9870,
      category: 'wellness' as const,
      isJoined: false,
      isPrivate: false,
      tags: ['wellness', 'holistic', 'health', 'mindfulness'],
      createdBy: 'Emma Wilson',
      createdAt: new Date('2023-04-05'),
      lastActivity: new Date(),
      rules: ['Be kind', 'Share tips', 'Support others'],
      moderators: ['Emma Wilson', 'Dr. Robert Kim']
    }
  ], [])

  // Mock posts data
  const posts = useMemo(() => [
    {
      id: 'post-1',
      author: {
        id: 'user-1',
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        level: 'expert' as const,
        badges: ['PhD', 'Researcher', 'Moderator'],
        isVerified: true
      },
      community: 'molecular-nutrition',
      title: 'New Research: Omega-3 and Cellular Membrane Fluidity',
      content: 'Exciting new research shows how omega-3 fatty acids affect cellular membrane fluidity and molecular signaling pathways. This has significant implications for our understanding of inflammation and metabolic health...',
      images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop'],
      tags: ['research', 'omega-3', 'cellular-health'],
      likes: 245,
      dislikes: 3,
      comments: 32,
      shares: 18,
      views: 1250,
      isLiked: false,
      isBookmarked: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'post' as const
    },
    {
      id: 'post-2',
      author: {
        id: 'user-2',
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        level: 'advanced' as const,
        badges: ['Nutritionist', 'Chef'],
        isVerified: false
      },
      community: 'vegan-molecular',
      title: 'Plant-Based Protein Optimization Guide',
      content: 'Here\'s my comprehensive guide to optimizing plant-based protein intake for molecular nutrition. Includes timing, combinations, and cooking methods that enhance bioavailability...',
      tags: ['vegan', 'protein', 'guide', 'plant-based'],
      likes: 189,
      dislikes: 1,
      comments: 28,
      shares: 42,
      views: 890,
      isLiked: true,
      isBookmarked: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: 'tip' as const
    },
    {
      id: 'post-3',
      author: {
        id: 'user-3',
        name: 'Coach Marcus',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        level: 'expert' as const,
        badges: ['Certified Trainer', 'Sports Nutritionist'],
        isVerified: true
      },
      community: 'fitness-nutrition',
      title: 'Pre-Workout Molecular Nutrition Protocol',
      content: 'My research-backed pre-workout nutrition protocol that optimizes molecular signaling for muscle protein synthesis and energy metabolism...',
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop'],
      tags: ['pre-workout', 'muscle-building', 'protocol'],
      likes: 312,
      dislikes: 5,
      comments: 45,
      shares: 67,
      views: 2100,
      isLiked: false,
      isBookmarked: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      type: 'post' as const
    }
  ], [])

  // Mock challenges data
  const challenges = useMemo(() => [
    {
      id: 'challenge-1',
      title: '30-Day Molecular Nutrition Challenge',
      description: 'Complete 30 days of optimal molecular nutrition tracking and see your health metrics improve!',
      category: 'nutrition',
      duration: 30,
      participants: 2840,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      isActive: true,
      isJoined: true,
      rewards: ['Achievement Badge', 'Expert Consultation', 'Premium Features'],
      requirements: ['Daily logging', '80% completion rate', 'Share progress'],
      progress: 75
    },
    {
      id: 'challenge-2',
      title: 'Hydration Master Challenge',
      description: 'Master your hydration game with molecular-level water tracking and optimization.',
      category: 'wellness',
      duration: 14,
      participants: 1920,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-29'),
      isActive: true,
      isJoined: false,
      rewards: ['Hydration Badge', 'Water Bottle'],
      requirements: ['Daily water tracking', 'Meet daily goals', 'Share tips']
    }
  ], [])

  // Mock leaderboard data
  const leaderboard = useMemo(() => [
    {
      id: 'user-1',
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      level: 'Expert',
      score: 9850,
      rank: 1,
      achievements: ['PhD', 'Researcher', 'Moderator'],
      isCurrentUser: false
    },
    {
      id: 'user-2',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      level: 'Advanced',
      score: 8920,
      rank: 2,
      achievements: ['Nutritionist', 'Chef'],
      isCurrentUser: false
    },
    {
      id: 'user-3',
      name: userProfile?.id || 'You',
      avatar: undefined,
      level: 'Intermediate',
      score: 7450,
      rank: 3,
      achievements: ['Consistent Logger', 'Community Helper'],
      isCurrentUser: true
    }
  ], [userProfile])

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = filterCategory === 'all' || 
        post.tags.includes(filterCategory) ||
        communities.find(c => c.id === post.community)?.category === filterCategory

      const matchesCommunity = !selectedCommunity || post.community === selectedCommunity

      return matchesSearch && matchesCategory && matchesCommunity
    })
  }, [posts, searchQuery, filterCategory, selectedCommunity, communities])

  const tabs = [
    { id: 'feed', label: 'Feed', icon: MessageSquare },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award }
  ]

  const categories = [
    { id: 'all', label: 'All', icon: Hash },
    { id: 'nutrition', label: 'Nutrition', icon: Shield },
    { id: 'fitness', label: 'Fitness', icon: Activity },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'science', label: 'Science', icon: Brain }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      case 'advanced': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'intermediate': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'beginner': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'fitness': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'wellness': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      case 'science': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary-600" />
            Community Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect with like-minded individuals passionate about molecular nutrition
          </p>
        </div>
        <motion.button
          onClick={() => setShowCreatePost(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-4 w-4" />
          Create Post
        </motion.button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts, communities, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    filterCategory === category.id
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              )
            })}
          </div>

          {/* Community Filter */}
          {activeTab === 'feed' && (
            <select
              value={selectedCommunity || ''}
              onChange={(e) => setSelectedCommunity(e.target.value || null)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Communities</option>
              {communities.map(community => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'feed' && (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  {/* Post Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {post.author.name}
                        </h3>
                        {post.author.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getLevelColor(post.author.level))}>
                          {post.author.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{communities.find(c => c.id === post.community)?.name}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {post.content}
                    </p>
                    {post.images && post.images.length > 0 && (
                      <div className="mt-3">
                        <img
                          src={post.images[0]}
                          alt="Post content"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-6">
                      <button className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                        post.isLiked 
                          ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      )}>
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <Share2 className="h-4 w-4" />
                        {post.shares}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={cn(
                        "p-2 rounded-lg transition-colors",
                        post.isBookmarked 
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      )}>
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community, index) => (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {community.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {community.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getCategoryColor(community.category))}>
                          {community.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {community.memberCount.toLocaleString()} members
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {community.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created by {community.createdBy}
                    </div>
                    <button
                      onClick={() => {
                        if (community.isJoined) {
                          onLeaveCommunity?.(community.id)
                        } else {
                          onJoinCommunity?.(community.id)
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        community.isJoined
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      )}
                    >
                      {community.isJoined ? 'Leave' : 'Join'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {challenge.title}
                        </h3>
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getCategoryColor(challenge.category))}>
                          {challenge.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {challenge.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <p className="font-medium">{challenge.duration} days</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Participants:</span>
                          <p className="font-medium">{challenge.participants.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Ends:</span>
                          <p className="font-medium">{challenge.endDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <p className={cn("font-medium", challenge.isActive ? "text-green-600" : "text-gray-500")}>
                            {challenge.isActive ? 'Active' : 'Ended'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {challenge.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rewards:</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.rewards.map((reward, rewardIndex) => (
                        <span
                          key={rewardIndex}
                          className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-xs rounded-full"
                        >
                          {reward}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {challenge.requirements.length} requirements
                    </div>
                    <button
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        challenge.isJoined
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      )}
                    >
                      {challenge.isJoined ? 'Leave Challenge' : 'Join Challenge'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary-600" />
                  Community Leaderboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Top contributors to the molecular nutrition community
                </p>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 flex items-center gap-4",
                      user.isCurrentUser && "bg-primary-50 dark:bg-primary-900/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 font-bold text-sm">
                        {user.rank}
                      </div>
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          "font-semibold",
                          user.isCurrentUser ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-gray-100"
                        )}>
                          {user.name}
                        </h4>
                        {user.isCurrentUser && (
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-600 px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getLevelColor(user.level.toLowerCase()))}>
                          {user.level}
                        </span>
                        <div className="flex gap-1">
                          {user.achievements.slice(0, 3).map((achievement, achievementIndex) => (
                            <span
                              key={achievementIndex}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {user.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        points
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
})
