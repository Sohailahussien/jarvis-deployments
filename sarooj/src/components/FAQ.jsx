import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What is electron beam irradiation?',
    answer: 'Electron beam irradiation is a process that uses high-energy electrons accelerated to near light speed to break the DNA chains of microorganisms, insects, and pathogens. This technology effectively sterilizes food products and medical devices without the use of chemicals or heat, preserving product quality while ensuring safety.',
  },
  {
    question: 'Is irradiated food safe to eat?',
    answer: 'Yes, irradiated food is completely safe. The process has been thoroughly studied for over 50 years and is approved by WHO, FDA, and numerous health authorities worldwide. The electron beam energy levels used are too low to make food radioactive. The process simply eliminates harmful bacteria and extends shelf life without affecting nutritional value.',
  },
  {
    question: 'What is the difference between E-Beam and X-Ray modes?',
    answer: 'E-Beam mode uses direct electron bombardment, which is ideal for thin, uniform products like ground beef or spices. X-Ray mode converts electrons to X-rays for deeper penetration, making it suitable for thick, dense, or palletized products. Our dual-mode accelerator allows us to choose the optimal method for each product type.',
  },
  {
    question: 'Does irradiation affect the taste or nutrition of food?',
    answer: 'No, when properly applied, irradiation does not noticeably affect the taste, texture, or nutritional value of food. Some vitamins may be slightly reduced, similar to other preservation methods like cooking or freezing, but the impact is minimal and the food remains nutritious.',
  },
  {
    question: 'How long does the irradiation process take?',
    answer: 'One of the major advantages of electron beam technology is speed. Products can be processed in seconds to minutes, depending on the dose required. This is significantly faster than gamma irradiation and allows for high throughput and efficient processing.',
  },
  {
    question: 'What products can be treated with e-beam irradiation?',
    answer: 'We treat a wide range of products including red meat, poultry, seafood, fresh produce, grains, spices, and egg products. For medical applications, we sterilize syringes, catheters, surgical kits, bandages, gloves, gowns, and other medical devices and supplies.',
  },
  {
    question: 'Is your facility certified?',
    answer: 'Yes, our facility maintains multiple certifications including ISO 9001:2015 for quality management, ISO 14001:2015 for environmental management, HACCP compliance for food safety, GMP certification, and approval from the Saudi FDA. We adhere to the highest international standards.',
  },
  {
    question: 'How do I get started with your services?',
    answer: 'Contact us through our website or call our office to discuss your requirements. Our team will conduct an initial assessment, recommend the appropriate treatment parameters, and provide a customized quote. We handle everything from sample testing to full-scale commercial processing.',
  },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-white/5 last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary-300' : 'text-white group-hover:text-primary-300'}`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-primary-500/20' : 'bg-dark-800 group-hover:bg-dark-700'
          }`}
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-primary-400' : 'text-dark-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-dark-300 leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent" />

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
            <HelpCircle className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">FAQ</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>

          <p className="text-lg text-dark-300 max-w-3xl mx-auto">
            Learn more about electron beam irradiation technology and our services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </motion.div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-dark-800/30 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary-400" />
              </div>
              <div className="text-left">
                <h4 className="text-white font-semibold">Still have questions?</h4>
                <p className="text-dark-400 text-sm">Our team is here to help.</p>
              </div>
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
