// BasicAccordion.js
import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close'; // The 'x' icon for closing
import styles from '../styles/FAQ.module.css'; // Make sure this path is correct

export default function BasicAccordion() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {/* Accordion Item 1 */}
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className={styles.accordion}>
        <AccordionSummary
          expandIcon={expanded === 'panel1' ? <CloseIcon className={styles.closeIcon} /> : <ExpandMoreIcon className={styles.plusIcon} />}
          aria-controls="panel1-content"
          id="panel1-header"
          className={styles.accordionSummary}
        >
          <Typography>What is Voxalink Pro and how does it revolutionize voice technology?</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          <Typography className={styles.accordionDetailsContent}>
            Voxalink Pro merges voice communication with blockchain technology,
            creating an intuitive and secure platform. It stands at the
            forefront of voice technology, utilizing AI for services like voice
            transcription and biometric authentication. This innovative approach
            aims to make voice commands activate smart contracts and enable
            voice-authenticated digital identities, making every spoken word
            valuable and secure.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion Item 2 */}
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className={styles.accordion}>
        <AccordionSummary
          expandIcon={expanded === 'panel2' ? <CloseIcon className={styles.closeIcon} /> : <ExpandMoreIcon className={styles.plusIcon} />}
          aria-controls="panel2-content"
          id="panel2-header"
          className={styles.accordionSummary}
        >
          <Typography>What are the key features and services offered by Voxalink Pro?</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          <Typography className={styles.accordionDetailsContent}>
            Voxalink Pro offers a suite of services including Voice
            Transcription, Voice Biometric Authentication APIs, and AI-powered
            insights and analytics. These services are designed to enhance
            global communication, improve security through voiceprint
            authentication, and provide deep insights into voice data for
            various applications like sentiment analysis and fraud detection.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion Item 3 */}
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className={styles.accordion}>
        <AccordionSummary
          expandIcon={expanded === 'panel3' ? <CloseIcon className={styles.closeIcon} /> : <ExpandMoreIcon className={styles.plusIcon} />}
          aria-controls="panel3-content"
          id="panel3-header"
          className={styles.accordionSummary}
        >
          <Typography>How can I buy $wVXLP and $VXLP tokens?</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          <Typography className={styles.accordionDetailsContent}>
            Initially, $wVXLP tokens can be purchased during the ICO above on the website. These are
            dummy tokens that will be exchangeable on a 1:1 ratio with $VXLP
            tokens post-ICO. Details regarding the purchase process, including
            the platforms where these tokens can be bought and the steps for
            exchanging $wVXLP for $VXLP, will be provided closer to the launch
            date.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion Item 4 */}
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className={styles.accordion}>
        <AccordionSummary
          expandIcon={expanded === 'panel4' ? <CloseIcon className={styles.closeIcon} /> : <ExpandMoreIcon className={styles.plusIcon} />}
          aria-controls="panel4-content"
          id="panel4-header"
          className={styles.accordionSummary}
        >
          <Typography>What are the benefits of holding VXLP tokens?</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          <Typography className={styles.accordionDetailsContent}>
            VXLP token holders will enjoy various benefits including access to
            advanced platform features, participation in community events, and
            the opportunity to vote on product development and governance.
            Tokens can also be staked for rewards and used in the Voxalink Pro
            marketplace for transactions.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion Item 5 */}
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} className={styles.accordion}>
        <AccordionSummary
          expandIcon={expanded === 'panel5' ? <CloseIcon className={styles.closeIcon} /> : <ExpandMoreIcon className={styles.plusIcon} />}
          aria-controls="panel5-content"
          id="panel5-header"
          className={styles.accordionSummary}
        >
          <Typography>What is the roadmap for Voxalink Pro's development and token release?</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          <Typography className={styles.accordionDetailsContent}>
            The roadmap details the phased development of Voxalink Pro,
            including key milestones like enabling live transcription and
            translation, launching VXLP tokens, adding voice-activated smart
            contracts, and introducing voice NFTs. Each phase focuses on
            expanding the platform's capabilities and enhancing user experience.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion Item 6 */}
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} className={styles.accordion}>
        <AccordionSummary
          expandIcon={expanded === 'panel6' ? <CloseIcon className={styles.closeIcon} /> : <ExpandMoreIcon className={styles.plusIcon} />}
          aria-controls="panel6-content"
          id="panel6-header"
          className={styles.accordionSummary}
        >
          <Typography>How does Voxalink Pro ensure the security and integrity of its platform and transactions?</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.accordionDetails}>
          <Typography className={styles.accordionDetailsContent}>
            Voxalink Pro's technical framework is built on a sophisticated AI
            infrastructure integrated with blockchain. This ensures real-time
            processing of voice data with unmatched accuracy and security.
            Features like smart contract constructors, reentrancy guards, and
            Chainlink integration are in place to protect against attacks and
            ensure valid transactions.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
