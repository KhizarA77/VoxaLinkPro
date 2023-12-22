import React, { useState } from "react";

export default function BasicAccordion() {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (panel) => {
    setExpanded(expanded === panel ? null : panel);
  };

  const AccordionItem = ({ panelId, title, content }) => {
    const isOpen = expanded === panelId;

    // Define a method for the hover effect to increase the transparency
    const applyHoverEffect = (e, opacity) => {
      e.currentTarget.style.background = `rgba(255, 255, 255, ${opacity})`;
    };

    return (
      <div
        className={`overflow-hidden shadow-lg mb-2 transition-all ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
        onMouseOver={(e) => applyHoverEffect(e, 0.2)} // Increase transparency on hover
        onMouseOut={(e) => applyHoverEffect(e, 0.1)} // Return to original transparency
      >
        <button
          className={`w-full text-left px-5 py-3 focus:outline-none transition duration-300 ease-in-out ${
            isOpen ? "rounded-t-lg" : "rounded-lg"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.1)", // White with semi-transparency
            backdropFilter: "saturate(180%) blur(30px)", // Glossy effect
            WebkitBackdropFilter: "saturate(180%) blur(30px)", // For cross-browser support
          }}
          onClick={() => handleToggle(panelId)}
        >
          <div className="flex justify-between items-center">
            <h2 className="font-normal text-white">{title}</h2>
            <span className="text-lg text-white">{isOpen ? "−" : "+"}</span>
          </div>
        </button>
        {isOpen && (
          <div
            className="text-white transition-all duration-300 ease-in-out rounded-b-lg"
            style={{
              background: `linear-gradient(to right, rgba(255, 20, 147, 0.5), rgba(106, 17, 203, 0.2))`, // Gradient background
              marginLeft: "0rem", // Indent content box to the left
              marginRight: "0rem", // Extend content box to the right
              position: "relative", // Needed for the pseudo-element to position itself
              backdropFilter: "saturate(180%) blur(30px)", // Glossy effect
              WebkitBackdropFilter: "saturate(180%) blur(30px)", // For cross-browser support
            }}
          >
            <div
              style={{
                position: "absolute", // Overlay is positioned absolutely
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "rgba(0, 0, 0, 0.2)", // Overlay with slight darkness
                borderRadius: "0 0 0.5rem 0.5rem", // Match the border radius of the container
              }}
            />
            <p className="px-5 py-3 relative">{content}</p>{" "}
            {/* relative to keep text above overlay */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="my-5 mx-5 space-y-2">
      <AccordionItem
        panelId="panel1"
        title="What is Voxalink Pro and how does it revolutionize voice technology?"
        content="Voxalink Pro merges voice communication with blockchain technology, 
                creating an intuitive and secure platform. It stands at the forefront of voice technology, 
                utilizing AI for services like voice transcription and biometric authentication. 
                This innovative approach aims to make voice commands activate smart contracts and enable voice-authenticated
                digital identities, making every spoken word valuable and secure."
      />
      <AccordionItem
        panelId="panel2"
        title="What are the key features and services offered by Voxalink Pro?"
        content="Voxalink Pro offers a suite of services including Voice Transcription, Voice Biometric Authentication APIs,
         and AI-powered insights and analytics. These services are designed to enhance global communication, improve security
          through voiceprint authentication, and provide deep insights into voice data for various applications like sentiment
           analysis and fraud detection."
      />
      <AccordionItem
        panelId="panel3"
        title="How can I buy $wVXLP and $VXLP tokens?"
        content="Initially, $wVXLP tokens can be purchased during the ICO above on the website. These are dummy tokens that will
         be exchangeable on a 1:1 ratio with $VXLP tokens post-ICO. Details regarding the purchase process, including the platforms
          where these tokens can be bought and the steps for exchanging $wVXLP for $VXLP, will be provided closer to the launch date."
      />
      <AccordionItem
        panelId="panel4"
        title="What are the benefits of holding VXLP tokens?"
        content="VXLP token holders will enjoy various benefits including access to advanced platform features, participation in community events,
         and the opportunity to vote on product development and governance. Tokens can also be staked for rewards and used in the Voxalink Pro
          marketplace for transactions."
      />
      <AccordionItem
        panelId="panel5"
        title="What is the roadmap for Voxalink Pro's development and token release?"
        content="The roadmap details the phased development of Voxalink Pro, including key milestones like enabling live transcription and translation,
         launching VXLP tokens, adding voice-activated smart contracts, and introducing voice NFTs. Each phase focuses on expanding the platform's 
         capabilities and enhancing user experience."
      />
      <AccordionItem
        panelId="panel6"
        title="How does Voxalink Pro ensure the security and integrity of its platform and transactions?"
        content="Voxalink Pro's technical framework is built on a sophisticated AI infrastructure integrated with blockchain.
         This ensures real-time processing of voice data with unmatched accuracy and security. Features like smart contract constructors,
          reentrancy guards, and Chainlink integration are in place to protect against attacks and ensure valid transactions"
      />
    </div>
  );
}
