import { motion } from 'framer-motion';
import { ParticleTextEffect } from '../components/ui/particle-text-effect';

interface WelcomePageProps {
  onEnter: () => void;
}

export default function WelcomePage({ onEnter }: WelcomePageProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Particle text canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="w-full flex-1 flex items-center justify-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="w-full" style={{ height: '40vh', maxHeight: 320 }}>
          <ParticleTextEffect
            text="Hello"
            fontSize={160}
            particleDensity={4}
            colors={['#c026d3', '#7c3aed', '#2563eb', '#e879f9', '#a78bfa', '#38bdf8']}
          />
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        className="flex flex-col items-center gap-6 pb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
      >
        <p className="text-slate-400 text-lg tracking-widest uppercase font-light">
          Welcome to InstaDash
        </p>
        <p className="text-slate-500 text-sm max-w-sm text-center leading-relaxed">
          Move your mouse over the text to interact.<br />
          Right-click to destroy particles.
        </p>

        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 px-10 py-3 rounded-full font-semibold text-white text-sm tracking-wide
            bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30
            hover:shadow-purple-500/50 hover:shadow-xl transition-all duration-300
            border border-white/10"
        >
          Enter Dashboard →
        </motion.button>
      </motion.div>
    </div>
  );
}
