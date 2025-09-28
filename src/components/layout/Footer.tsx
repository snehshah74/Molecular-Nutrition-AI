import { motion } from 'framer-motion'
import { Dna, Heart, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              className="flex items-center space-x-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Dna className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Molecular Nutrition AI
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personalized nutrition at the molecular level
                </p>
              </div>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Harnessing the power of AI and molecular biology to provide personalized 
              nutrition recommendations that optimize your health at the cellular level.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                'Dashboard',
                'Food Logging',
                'AI Recommendations',
                'Progress Tracking',
                'User Profile'
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {[
                'Help Center',
                'Documentation',
                'API Reference',
                'Contact Us',
                'Privacy Policy'
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Molecular Nutrition AI. All rights reserved.
            </p>
            <motion.div
              className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mt-4 md:mt-0"
              whileHover={{ scale: 1.05 }}
            >
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for better health</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
