import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Shield, Clock, Globe } from 'lucide-react';

const stats = [
  {
    icon: TrendingUp,
    value: 99.9,
    suffix: '%',
    label: 'Pathogen Elimination',
    description: 'Kill rate for harmful bacteria',
  },
  {
    icon: Shield,
    value: 20,
    suffix: '+',
    label: 'Years Experience',
    description: 'Industry expertise',
  },
  {
    icon: Clock,
    value: 24,
    suffix: '/7',
    label: 'Operations',
    description: 'Round-the-clock processing',
  },
  {
    icon: Globe,
    value: 15,
    suffix: '+',
    label: 'Countries Served',
    description: 'Regional coverage',
  },
];

function AnimatedCounter({ value, suffix, inView }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current * 10) / 10);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 via-dark-900 to-accent-900/20" />
      <div className="absolute inset-0 bg-dark-950/80" />

      {/* Top and bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      {/* Animated beam across */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: [0, 0.5, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
      </motion.div>

      <div ref={ref} className="relative container-custom px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className="w-7 h-7 text-primary-400" />
                </motion.div>

                {/* Value */}
                <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
                </div>

                {/* Label */}
                <div className="text-white font-medium mb-1">{stat.label}</div>

                {/* Description */}
                <div className="text-dark-500 text-sm">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
