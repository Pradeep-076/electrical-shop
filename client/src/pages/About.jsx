import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const About = () => {
    return (
        <div className="pt-24 pb-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Mission Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-gray-900 mb-6"
                    >
                        About <span className="text-electric">Sri Vela</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Established in 2020, we have been the leading provider of high-quality electrical solutions.
                        Our mission is to illuminate every home and business with safe, efficient, and durable products.
                    </p>
                </div>

                {/* Timeline / Journey */}
                <div className="relative border-l-2 border-gray-200 ml-4 md:ml-1/2 space-y-12">
                    {[
                        { year: '2020', title: 'Foundation', desc: 'Started as a small retail shop in Namakkal.' },
                        { year: '2022', title: 'Expansion', desc: 'Expanded to wholesale distribution across the district.' },
                        { year: '2023', title: 'Modernization', desc: 'Partnered with top global brands like Philips, Finolex, and Legrand.' },
                        { year: '2026', title: 'Digital Era', desc: 'Launching our online platform to serve customers better.' }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`relative pl-8 md:pl-0 flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            <div className="absolute left-[-9px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-electric border-4 border-white shadow-lg z-10"></div>

                            <div className="md:w-1/2 md:px-12 w-full">
                                <div className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 ${index % 2 === 0 ? 'text-left' : 'text-left md:text-right'}`}>
                                    <span className="text-electric font-bold text-xl block mb-2">{item.year}</span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                            <div className="md:w-1/2"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Team / Vision Cards */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-electric/5 to-blue-50 p-8 rounded-3xl border border-electric/10"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                            <CheckCircle className="text-electric" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To be the most trusted electrical partner in the region, known for quality, integrity, and innovation in lighting and energy solutions.
                        </p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl border border-orange-100"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                            <CheckCircle className="text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2">Customer First Approach</li>
                            <li className="flex items-center gap-2">Uncompromising Quality</li>
                            <li className="flex items-center gap-2">Sustainable Practices</li>
                        </ul>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default About;
