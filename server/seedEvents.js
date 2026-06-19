const mongoose = require("mongoose");
const Event = require("./models/Event");
const User = require("./models/User");
require("dotenv").config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB...");

  // Find a user or create one
  let user = await User.findOne();
  if (!user) {
    user = await User.create({ name: "Admin", email: "admin@eventx.com", password: "password123", role: "admin" });
  }

  const eventsList = [
    {
      title: "Global AI Summit 2026",
      description: "Join the world's leading AI researchers as they discuss the next decade of artificial intelligence. Keynotes from industry leaders, workshops, and exclusive networking events.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
      price: 299,
      maxParticipants: 500,
      category: "Tech",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "React Native Masterclass",
      description: "A comprehensive 2-day deep dive into building performant mobile apps using React Native and Expo.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      price: 99,
      maxParticipants: 200,
      category: "Workshop",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "FinTech Global Tour",
      description: "Exploring the future of decentralized finance, banking, and global monetary policy.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      price: 150,
      maxParticipants: 350,
      category: "Seminar",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Esports World Championship",
      description: "Witness the best teams battle it out in the ultimate tournament for a $1M prize pool.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      price: 45,
      maxParticipants: 1000,
      category: "Sports",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Design Systems Conference",
      description: "Learn how the world's best companies scale their UI and UX teams across hundreds of products.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // Past event
      price: 199,
      maxParticipants: 300,
      category: "Tech",
      status: "completed",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Cybersecurity Defense Summit",
      description: "Protecting data in the modern age. Best practices, hacking simulations, and network deep dives.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      price: 0,
      maxParticipants: 500,
      category: "Tech",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Startup Pitch Night",
      description: "10 startups. 5 investors. 1 winner. An electric night of innovation and funding.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
      price: 25,
      maxParticipants: 150,
      category: "Seminar",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Advanced TypeScript Workshop",
      description: "From generics to advanced mapped types. Stop writing 'any' and start writing solid TS.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      price: 120,
      maxParticipants: 50,
      category: "Workshop",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "SaaS Growth Hackers",
      description: "Learn how to acquire your first 10,000 users without spending a dime on ads.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
      price: 0,
      maxParticipants: 1000,
      category: "Seminar",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Web3 Developer Bootcamp",
      description: "Deploying smart contracts, writing solidity, and mastering decentralized infrastructure.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
      price: 499,
      maxParticipants: 100,
      category: "Workshop",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
    {
      title: "Global Tech Innovators",
      description: "Next-gen gadgets, autonomous driving, and massive tech breakthroughs.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // Past
      price: 50,
      maxParticipants: 800,
      category: "Tech",
      status: "completed",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
      {
      title: "Local Hackathon - City Edition",
      description: "48 hours to build a product that impacts the local community. Free food, great prizes.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
      price: 0,
      maxParticipants: 250,
      category: "Tech",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    },
      {
      title: "Women in Engineering Mixer",
      description: "A networking event specifically focused on accelerating the careers of women in tech.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22),
      price: 15,
      maxParticipants: 150,
      category: "Seminar",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3",
      createdBy: user._id
    },
      {
      title: "Open Source Contributor Day",
      description: "Let's fix some bugs! A guided session to making your first contribution to large repos.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      price: 0,
      maxParticipants: 100,
      category: "Workshop",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2669&ixlib=rb-4.0.3",
      createdBy: user._id
    },
      {
      title: "Annual Developers Retreat",
      description: "A week-long getaway for senior engineers to disconnect and brainstorm future architectures.",
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      price: 1999,
      maxParticipants: 50,
      category: "Tech",
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
      createdBy: user._id
    }
  ];

  await Event.insertMany(eventsList);
  console.log("15 premium events successfully added!");
  process.exit();
}

seed();
