import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Radio, Shield, Clock, ChevronRight, Check } from 'lucide-react';

const technologies = [
  {
    id: 'ebeam',
    icon: Zap,
    title: 'E-Beam Mode',
    subtitle: 'Electron Beam Irradiation',
    description: 'Electrons are accelerated to near light speed using microwaves, breaking the DNA chains of pathogens. Products receive radiant energy from upper and lower accelerators simultaneously.',
    features: [
      'Processing in seconds, not hours',
      'No product flipping required',
      'Ideal for thin, uniform products',
      'Maximum penetration: 8-10 cm',
    ],
    color: 'primary',
    animation: 'beam',
  },
  {
    id: 'xray',
    icon: Radio,
    title: 'X-Ray Mode',
    subtitle: 'Deep Penetration Technology',
    description: 'Electrons are converted to X-rays through interaction with dense metals, enabling treatment of bulky, non-uniform, and high-density products.',
    features: [
      'Products rotated 180° for complete treatment',
      'Treats thick, dense products',
      'Uniform dose distribution',
      'Ideal for palletized goods',
    ],
    color: 'accent',
    animation: 'xray',
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Non-Radioactive',
    description: 'Accelerator energy is too low to induce radioactivity in any material.',
  },
  {
    icon: Clock,
    title: 'Instant Processing',
    description: 'Treatment takes seconds, maintaining product throughput efficiency.',
  },
  {
    icon: Zap,
    title: 'Chemical-Free',
    description: 'No chemicals or additives used, preserving natural product qualities.',
  },
];

function BeamVisualization({ mode }) {
  return (
    <div className="relative h-64 bg-dark-900/50 rounded-2xl overflow-hidden border border-white/5">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,153,230,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,153,230,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {mode === 'ebeam' ? (
        <>
          {/* E-Beam visualization */}
          {/* Upper accelerator */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(0,153,230,0.5)', '0 0 40px rgba(0,153,230,0.8)', '0 0 20px rgba(0,153,230,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-bold text-white">ACCELERATOR</span>
          </motion.div>

          {/* Beam from top */}
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-primary-400 to-transparent"
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
          />

          {/* Product */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-12 rounded-lg bg-dark-700 border-2 border-primary-500/30 flex items-center justify-center"
            animate={{ borderColor: ['rgba(0,153,230,0.3)', 'rgba(0,153,230,0.8)', 'rgba(0,153,230,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-dark-300">PRODUCT</span>
          </motion.div>

          {/* Lower accelerator */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(0,153,230,0.5)', '0 0 40px rgba(0,153,230,0.8)', '0 0 20px rgba(0,153,230,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-bold text-white">ACCELERATOR</span>
          </motion.div>

          {/* Beam from bottom */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-t from-primary-400 to-transparent"
            initial={{ height: 0 }}
            animate={{ height: 60 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
          />

          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary-400"
              style={{
                left: `${40 + Math.random() * 20}%`,
                top: `${30 + Math.random() * 40}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </>
      ) : (
        <>
          {/* X-Ray visualization */}
          {/* X-Ray source */}
          <motion.div
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-20 rounded-lg bg-gradient-to-r from-accent-600 to-accent-400 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(34,197,94,0.5)', '0 0 40px rgba(34,197,94,0.8)', '0 0 20px rgba(34,197,94,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[10px] font-bold text-white rotate-[-90deg]">X-RAY</span>
          </motion.div>

          {/* X-Ray beams */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-16 h-0.5 bg-gradient-to-r from-accent-400 to-transparent"
              style={{
                top: `${35 + i * 7}%`,
                width: '60%',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.8, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}

          {/* Rotating product */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: [0, 180, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
          >
            <div className="w-16 h-20 rounded-lg bg-dark-700 border-2 border-accent-500/30 flex items-center justify-center">
              <span className="text-xs text-dark-300">PALLET</span>
            </div>
          </motion.div>

          {/* 180° indicator */}
          <motion.div
            className="absolute top-4 right-4 text-xs text-accent-400 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            180° ROTATION
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function Technology() {
  const [selectedTech, setSelectedTech] = useState('ebeam');
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const currentTech = technologies.find(t => t.id === selectedTech);

  return (
    <section id="technology" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent" />

      <div ref={ref} className="relative container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Our Technology</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Dual-Mode <span className="gradient-text">Accelerator System</span>
          </h2>

          <p className="text-lg text-dark-300 max-w-3xl mx-auto">
            Our state-of-the-art facility features a dual electron beam accelerator capable of
            operating in both E-Beam and X-Ray modes for maximum flexibility.
          </p>
        </motion.div>

        {/* Technology Selector */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Tab buttons */}
          <div className="space-y-4">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              const isSelected = selectedTech === tech.id;

              return (
                <motion.button
                  key={tech.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  onClick={() => setSelectedTech(tech.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? `bg-${tech.color}-500/10 border-${tech.color}-500/30`
                      : 'bg-dark-900/50 border-white/5 hover:border-white/10'
                  }`}
                  style={isSelected ? {
                    backgroundColor: tech.color === 'primary' ? 'rgba(0,153,230,0.1)' : 'rgba(34,197,94,0.1)',
                    borderColor: tech.color === 'primary' ? 'rgba(0,153,230,0.3)' : 'rgba(34,197,94,0.3)',
                  } : {}}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? tech.color === 'primary' ? 'bg-primary-500/20' : 'bg-accent-500/20'
                          : 'bg-dark-800'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isSelected
                            ? tech.color === 'primary' ? 'text-primary-400' : 'text-accent-400'
                            : 'text-dark-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-dark-200'}`}>
                            {tech.title}
                          </h3>
                          <p className="text-sm text-dark-400">{tech.subtitle}</p>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            isSelected ? 'rotate-90 text-primary-400' : 'text-dark-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-white/5"
                      >
                        <p className="text-dark-300 text-sm mb-4">{tech.description}</p>
                        <ul className="space-y-2">
                          {tech.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-dark-300">
                              <Check className={`w-4 h-4 ${tech.color === 'primary' ? 'text-primary-400' : 'text-accent-400'}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-32"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">{currentTech?.title} Visualization</h4>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTech === 'ebeam'
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'bg-accent-500/20 text-accent-300'
                }`}>
                  LIVE DEMO
                </div>
              </div>
              <BeamVisualization mode={selectedTech} />
            </div>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="card group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-dark-400 text-sm">{benefit.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
