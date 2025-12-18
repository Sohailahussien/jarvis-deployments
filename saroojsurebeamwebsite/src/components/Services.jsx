import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Beef,
  Salad,
  Wheat,
  Egg,
  Syringe,
  Stethoscope,
  Package,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

const services = [
  {
    category: 'Food Irradiation',
    description: 'Eliminate pathogens and extend shelf life without chemicals or additives.',
    icon: Sparkles,
    color: 'primary',
    items: [
      {
        icon: Beef,
        title: 'Red Meat & Poultry',
        description: 'Eliminate E. coli, Salmonella, and other harmful bacteria while preserving taste and nutrition.',
        benefits: ['99.9% pathogen elimination', 'Extended shelf life', 'No taste alteration'],
      },
      {
        icon: Salad,
        title: 'Fresh Vegetables',
        description: 'Control insects, delay ripening, and extend freshness for produce distribution.',
        benefits: ['Insect disinfestation', 'Delayed ripening', 'Reduced spoilage'],
      },
      {
        icon: Wheat,
        title: 'Grains & Spices',
        description: 'Eliminate mold, insects, and contamination in stored grains and imported spices.',
        benefits: ['Mold prevention', 'Insect control', 'Extended storage life'],
      },
      {
        icon: Egg,
        title: 'Egg Products',
        description: 'Ensure safety of liquid eggs and egg products for food service applications.',
        benefits: ['Salmonella elimination', 'Safe for raw use', 'Quality preservation'],
      },
    ],
  },
  {
    category: 'Medical Sterilization',
    description: 'Terminal sterilization for medical devices and pharmaceutical products.',
    icon: Stethoscope,
    color: 'accent',
    items: [
      {
        icon: Syringe,
        title: 'Syringes & Catheters',
        description: 'Complete sterilization of single-use medical devices and surgical instruments.',
        benefits: ['SAL 10⁻⁶ achieved', 'Material compatible', 'No residuals'],
      },
      {
        icon: Package,
        title: 'Medical Kits',
        description: 'Sterilize pre-packaged surgical kits and medical supplies in final packaging.',
        benefits: ['Through-package sterilization', 'Immediate use ready', 'Validated process'],
      },
    ],
  },
];

function ServiceCard({ item, index, color }) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="card h-full">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${
            color === 'primary'
              ? 'bg-primary-500/10 group-hover:bg-primary-500/20'
              : 'bg-accent-500/10 group-hover:bg-accent-500/20'
          }`}
        >
          <Icon
            className={`w-7 h-7 ${
              color === 'primary' ? 'text-primary-400' : 'text-accent-400'
            }`}
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-dark-400 text-sm mb-5 leading-relaxed">
          {item.description}
        </p>

        {/* Benefits */}
        <ul className="space-y-2">
          {item.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check
                className={`w-4 h-4 flex-shrink-0 ${
                  color === 'primary' ? 'text-primary-400' : 'text-accent-400'
                }`}
              />
              <span className="text-dark-300">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Hover gradient border */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
            color === 'primary'
              ? 'bg-gradient-to-br from-primary-500/10 to-transparent'
              : 'bg-gradient-to-br from-accent-500/10 to-transparent'
          }`}
        />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="services" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium text-accent-300">Our Services</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Comprehensive <span className="gradient-text">Irradiation Services</span>
          </h2>

          <p className="text-lg text-dark-300 max-w-3xl mx-auto">
            From food safety to medical sterilization, we provide complete electron beam
            irradiation solutions for diverse industries across the Middle East.
          </p>
        </motion.div>

        {/* Services */}
        {services.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.category} className="mb-16 last:mb-0">
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    category.color === 'primary' ? 'bg-primary-500/10' : 'bg-accent-500/10'
                  }`}
                >
                  <CategoryIcon
                    className={`w-6 h-6 ${
                      category.color === 'primary' ? 'text-primary-400' : 'text-accent-400'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {category.category}
                  </h3>
                  <p className="text-dark-400">{category.description}</p>
                </div>
              </motion.div>

              {/* Service Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((item, index) => (
                  <ServiceCard
                    key={item.title}
                    item={item}
                    index={index}
                    color={category.color}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl glass">
            <div className="text-center sm:text-left">
              <h4 className="text-xl font-semibold text-white mb-2">
                Need a custom irradiation solution?
              </h4>
              <p className="text-dark-400">
                Contact us to discuss your specific requirements.
              </p>
            </div>
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
