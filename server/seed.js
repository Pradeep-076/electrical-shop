const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');

const products = [
    {
        name: 'LED Tubelight 20W',
        category: 'LED Lights',
        price: 150,
        description: 'High brightness 20W LED tubelight with energy saving technology. Long life span and flicker-free illumination.',
        imageUrl: '/images/led-tubelight-20w.png',
        stock: 200
    },
    {
        name: 'LED Bulb 9W',
        category: 'LED Lights',
        price: 70,
        description: 'Energy efficient 9W cool white LED bulb with 1 year warranty. Saves up to 80% energy compared to traditional bulbs.',
        imageUrl: 'https://images.pexels.com/photos/45072/pexels-photo-45072.jpeg?auto=compress&cs=tinysrgb&w=500',
        stock: 500
    },
    {
        name: 'Ceiling Fan',
        category: 'Fans',
        price: 1950,
        description: 'High speed ceiling fan with aerodynamic blades and silent motor. Available in multiple colors.',
        imageUrl: '/images/ceiling-fan-white.png',
        stock: 50
    },
    {
        name: 'Water Heater 10L',
        category: 'Appliances',
        price: 6500,
        description: 'Instant water heater 10 litre with advanced safety features. Energy efficient with auto cut-off protection.',
        imageUrl: '/images/water-heater.png',
        stock: 25
    },
    {
        name: '1.0 Sq mm Wire',
        category: 'Wires',
        price: 1480,
        description: 'Premium quality 1.0 sq mm flame retardant copper wires. High conductivity and durable insulation.',
        imageUrl: '/images/wires-cables.png',
        stock: 100
    },
    {
        name: 'Tape Roll',
        category: 'Accessories',
        price: 10,
        description: 'High quality electrical insulation tape roll. Flame resistant, strong adhesive, and long-lasting.',
        imageUrl: '/images/tap-roll.png',
        stock: 1000
    },
    {
        name: '1 Inch 15kg PVC Pipe',
        category: 'Pipes',
        price: 350,
        description: 'ISI marked 1 inch 15kg PVC conduit pipes for electrical wiring. Durable, anti-corrosive, and easy to install.',
        imageUrl: '/images/pvc-pipes.png',
        stock: 300
    },
    {
        name: '1 Inch CPVC Pipe',
        category: 'Pipes',
        price: 420,
        description: 'High grade 1 inch CPVC pipes for hot and cold water applications. Heat resistant and long lasting.',
        imageUrl: '/images/cpvc-pipes.png',
        stock: 150
    },
    {
        name: '4W MCB Box',
        category: 'Accessories',
        price: 200,
        description: 'Galvanized metal 4 way MCB distribution box for switch and socket mounting. Rust proof and sturdy construction.',
        imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=500',
        stock: 500
    },
    {
        name: '1 Inch Star Screw',
        category: 'Accessories',
        price: 1,
        description: 'High quality 1 inch star head screws. Corrosion resistant, durable, and suitable for electrical fittings.',
        imageUrl: '/images/screws.png',
        stock: 2000
    }
];

const seedDB = async () => {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Database seeded with products.');
    mongoose.connection.close();
};

seedDB();
