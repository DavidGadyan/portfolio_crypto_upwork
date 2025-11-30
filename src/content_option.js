import myImage from "./assets/images/trader_portfolio_img.jpg";
import cryptoImage from "./assets/images/crypto_coins.jpeg";
import aiStrategy from "./assets/images/ai_strategy.jpg";
import sentimentImage from "./assets/images/sentiment-analysis.webp";

const logotext = "DAVID";

const meta = {
  title: "David Gadyan – Algorithmic Trader & Data Scientist",
  description:
    "I’m David Gadyan, an algorithmic trader and data scientist specializing in AI-driven crypto trading strategies, quantitative research, and end-to-end AI solutions.",
  url: "https://davitgadyan.github.io/portfolio_app/",
  lang: "en",
  author: "David Gadyan",
  keywords: [
    "David Gadyan",
    "algorithmic trader",
    "crypto trading",
    "data scientist",
    "AI engineer",
    "machine learning",
    "quantitative trading",
    "deep learning",
    "generative AI",
    "LLM developer",
    "Chatbot developer",
    "full stack developer",
  ],
  // GEO info – useful for local SEO and as a hint for LLMs
  geo: {
    regionCode: "ES-B", // Barcelona (adjust if needed)
    latitude: "41.3874",
    longitude: "2.1686",
    city: "Barcelona",
    country: "Spain",
  },
};

const introdata = {
  title: "I’m David Gadyan",
  animated: {
    first: "Algorithmic Trader",
    second: "Data Scientist",
    third: "Full Stack Developer",
    forth: "Generative AI Engineer",
  },
  description:
    "Enhancing crypto trading strategies for high-probability setups using AI and quantitative research.",
  your_img_url: myImage,
};

const dataabout = {
  title: "Bio",
  aboutme: `
    Welcome! 
    
    I'm David, a seasoned Data Scientist with over 8 years of experience and a track record of 180+ successful projects in the Data Science field and another 8 years in the Finance sector. My expertise lies in transforming complex business challenges into innovative solutions powered by AI and my creative problem-solving skills.

    A major part of my services is enhancing crypto trading strategies for high-probability setups using AI.

    Comprehensive AI Solutions: Whether you need to validate a business idea with a robust MVP or enhance your existing services, I specialize in delivering tailored AI solutions that drive success.

    I am dedicated to contributing to your projects in a way that ensures mutual success. My strategic approach not only addresses immediate business needs but also positions your projects for long-term growth and innovation.

    If you're looking to leverage cutting-edge AI technologies to elevate your business, let's connect and turn your vision into reality. Trust in my proven expertise to navigate the complexities of your data science journey.
    `,
};

const worktimeline = [
  {
    jobtitle: "PMBA Data Science",
    where: "AUA American University of Armenia",
    date: "2017-2020",
  },
  {
    jobtitle: "Accountant",
    where: "Ernst & Young",
    date: "2017-2018",
  },
  {
    jobtitle: "Data Science for Decision Making",
    where: "Barcelona School of Economics",
    date: "2022-2023",
  },
  {
    jobtitle: "Data Scientist",
    where: "Upwork.com",
    date: "2018-Present",
  },
];

const skills = [
  {
    name: "Data Science",
    value: 95,
  },
  {
    name: "Machine Learning & Deep Learning",
    value: 90,
  },
  {
    name: "Algorithmic Trading",
    value: 85,
  },
  {
    name: "Generative AI",
    value: 80,
  },
  {
    name: "Full Stack Development",
    value: 60,
  },
];

const services = [
  {
    title: "Algorithmic Trading Strategy Development",
    description:
      "Build AI-powered crypto trading strategies with technical, orderflow, and fundamental analysis techniques.",
  },
  {
    title: "Data Science Projects",
    description:
      "Solve business problems and build automations using Machine Learning, Deep Learning, Reinforcement Learning, and Computer Vision.",
  },
  {
    title: "Building websites and mobile apps",
    description:
      "Build websites and mobile apps with AI models integrated into the product.",
  },
];

const dataportfolio = [
  {
    img: sentimentImage,
    description: "Sentiment Monitoring QLora Fine-tuned TinyLlama Tool",
    link: "https://github.com/DavidGadyan/project_news_social_sentiment_crypto",
  },
  {
    img: cryptoImage,
    description: "Traded Crypto Portfolio Diversification",
    link: "https://github.com/DavidGadyan/project_crypto_negative_cointegration",
  },
  {
    img: aiStrategy,
    description: "AI powered Crypto Strategy",
    link: "/entries",
  },
];

const contactConfig = {
  YOUR_EMAIL: "davidgadyan92@gmail.com",
  YOUR_FONE: "+34-620-474-042",
  description: "My timezone is UTC +2 Spain",
  YOUR_SERVICE_ID: "service_9eaa80n",
  YOUR_TEMPLATE_ID: "template_270jqlb",
  YOUR_USER_ID: "xlYCz5s0OzeWrtUn9",
};

const socialprofils = {
  linkedin: "https://www.linkedin.com/in/davidgadyan",
  github: "https://github.com/DavidGadyan",
  twitter: "https://x.com/aicrypto42",
};

export {
  meta,
  dataabout,
  dataportfolio,
  worktimeline,
  skills,
  services,
  introdata,
  contactConfig,
  socialprofils,
  logotext,
};
