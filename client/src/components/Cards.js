"use client";
import React, { useCallback, useRef } from "react";
import styles from "../styles/FancyCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Card = ({ image, title, description, button, link, variants }) => {
  const buttonBgClass =
    button === "Coming Soon"
      ? "bg-gray-400 text-white pointer-none"
      : "bg-gradient-to-r from-[#E23E57] to-[#88304E] text-gray-100";

  return (
    <Link href={link}>
      <motion.div
        className={`${styles.card}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }} // Ensures the animation only happens once
        transition={{ duration: 0.8 }} // Duration of the animation
        variants={variants} // Animation variants for hidden/visible states
      >
        <div className={`${styles.card}`}>
          <div className={styles.cardContent}>
            <div className="p-3 md:p-4 mb-5">
              <button className={`p-2  ${buttonBgClass} rounded-lg text-sm`}>
                {button}
              </button>
            </div>
            <div
              className={`${styles.cardImage} flex justify-center items-center`}
            >
              <Image src={image} height={190} width={190} />
            </div>
            <div className={styles.cardInfoWrapper}>
              <div className={`${styles.cardInfo}`}>
                <div className={styles.cardInfoTitle}>
                  <h3>{title}</h3>
                  <h4>{description}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const CardsContainer = () => {
  const cardsContainerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.getElementsByClassName(
        styles.card
      );
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      }
    }
  }, []);

  // Sample data for cards
  const cardsData = [
    {
      image: "/images/transcribe.png",
      title: "AI Transcriber",
      description: "Transcribes your video/audio and outputs subtitles",
      buttonName: "15 December",
      buttonLink: "#",
    },
    {
      image: "/images/voiceauthentication.png",
      title: "Voice Authentication",
      description:
        "Security feature that verifies if the person speaking is same or not",
      buttonName: "Coming Soon",
      buttonLink: "#",
    },
    {
      image: "/images/analyzer2.png",
      title: "AI Analyzer",
      description: "Analyzes your data using our accurate model",
      buttonName: "Coming Soon",
      buttonLink: "#",
    },
    {
      image: "/images/calender.png",
      title: "AI Meeting Planner",
      description: "Plans trip according to your prompt with ONE click booking",
      buttonName: "Coming Soon",
      buttonLink: "#",
    },
    {
      image: "/images/VoiceNFT.png",
      title: "Voice NFTs",
      description:
        "Allow users to create, authenticate, and trade unique voice recordings",
      buttonName: "Coming Soon",
      buttonLink: "#",
    },
    {
      image: "/images/SmartContracts.png",
      title: "Voice Activated Smart Contracts",
      description:
        "Verbal agreements become binding contracts through voice commands",
      buttonName: "Coming Soon",
      buttonLink: "#",
    },

    // ...add as many cards as you want
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Start with opacity 0 and 50px below
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Delay each card's animation by its index
        duration: 0.5,
      },
    }),
  };

  return (
    <div
      ref={cardsContainerRef}
      className={`${styles.cards} grid grid-cols-1 lg:grid-cols-3 gap-10`}
      onMouseMove={handleMouseMove}
    >
      {cardsData.map((data, index) => (
        <Card
          key={index}
          image={data.image}
          title={data.title}
          description={data.description}
          button={data.buttonName}
          link={data.buttonLink}
          variants={cardVariants} // Pass the variants to the Card component
          custom={index} // Pass the index as a custom prop for the delay calculation
        />
      ))}
    </div>
  );
};

export default CardsContainer;
