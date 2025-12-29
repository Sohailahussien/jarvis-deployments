import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Building2,
  Users,
  Award,
  Globe,
  CheckCircle2,
  MapPin,
  Calendar,
  Target,
} from 'lucide-react';

const timeline = [
  {
    year: '2002',
    title: 'Joint Venture Formed',
    description: 'SureBeam Corporation (USA) and RESAL Saudi Corp. establish SureBeam Middle East LLC.',
  },
  {
    year: '2004',
    title: 'Facility Completion',
    description: 'State-of-the-art electron beam facility opens in the 2nd Industrial City of Riyadh.',
  },
  {
    year: '2005',
    title: 'Commercial Operations',
    description: 'Begin full commercial operations serving food and medical industries across the region.',
  },
  {
    year: 'Present',
    title: 'Regional Leader',
    description: 'Established as the premier e-beam irradiation facility serving the Middle East market.',
  },
];

const stats = [
  { icon: Building2, value: '1st', label: 'E-Beam Facility in Middle East' },
  { icon: Users, value: '1000+', label: 'Clients Served' },
  { icon: Award, value: 'ISO', label: 'Certified Operations' },
  { icon: Globe, value: '15+', label: 'Countries Served' },
];

const certifications = [
  'ISO 9001:2015 Quality Management',
  'ISO 14001:2015 Environmental Management',
  'OHSAS 18001 Occupational Health & Safety',
  'GMP Certified Facility',
  'HACCP Compliant',
  'Saudi FDA Approved',
];

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="about" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900" />

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
            <Building2 className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">About Us</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Pioneering <span className="gradient-text">Food Safety</span> in the Middle East
          </h2>

          <p className="text-lg text-dark-300 max-w-3xl mx-auto">
            A joint venture between RESAL Saudi Corp. and SureBeam Corporation, we brought the
            first electron beam irradiation technology to the Middle East region.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-dark-800/30 border border-white/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-5 h-5 text-primary-400" />
              <h3 className="text-2xl font-display font-bold text-white">Our Journey</h3>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-500/20 to-transparent" />

              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative pl-12 pb-10 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-dark-900 border-2 border-primary-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                  </div>

                  <div className="bg-dark-800/30 rounded-xl p-5 border border-white/5 hover:border-primary-500/20 transition-colors">
                    <div className="text-sm font-mono text-primary-400 mb-2">{item.year}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-dark-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Cards */}
          <div className="space-y-6">
            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Our Location</h4>
              </div>
              <p className="text-dark-300 mb-4">
                8208 Al Turaif Al Ala Street<br />
                2nd Industrial City<br />
                Riyadh, Ar Riyad 14332<br />
                Kingdom of Saudi Arabia
              </p>
              <div className="aspect-video rounded-xl bg-dark-800/50 overflow-hidden">
                {/* Map placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary-400/50 mx-auto mb-2" />
                    <span className="text-sm text-dark-500">Riyadh, Saudi Arabia</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Our Mission</h4>
              </div>
              <p className="text-dark-300">
                To provide world-class electron beam irradiation services that enhance food safety,
                extend shelf life, and ensure sterility of medical products throughout the Middle
                East region, while maintaining the highest standards of quality and environmental
                responsibility.
              </p>
            </motion.div>

            {/* Certifications Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">Certifications</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-300">{cert}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
