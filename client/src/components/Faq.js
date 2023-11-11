import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function BasicAccordion() {
  return (
    <div>
      <Accordion sx={{ background: "#545151", color: "white" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ color: "white" }}
        >
          <Typography>What is VoxaLinkPro?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: "white", backgroundColor: "#353535" }}>
          <Typography>
            VoxaLinkPro is an advanced platform for AI services, leveraging the
            Ethereum blockchain to facilitate the seamless delivery of
            AI-powered solutions. By utilizing the VoxaLinkPro token ($VXLP),
            users can access a range of AI services, including natural language
            processing, machine learning, and data analytics. The $VXLP token is
            more than just a currency; it's an integral part of our ecosystem,
            designed to streamline transactions within the AI service market,
            ensuring security, transparency, and efficiency. Holding $VXLP
            tokens means being at the forefront of AI technology and
            participating in the growth of a cutting-edge industry
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ background: "#545151", color: "white" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{ color: "white" }}
        >
          <Typography>How can I buy $VXLP?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: "white", backgroundColor: "#353535" }}>
          <Typography>
            $VXLP can be acquired directly on our official website,
            voxalinkpro.com, using ETH/USDT. To purchase $VXLP, you will need to
            have a wallet service that supports Ethereum, such as MetaMask, and
            ensure that you have enough ETH/USDT to cover both the purchase and
            transaction fees (gas fees). Follow our step-by-step guide on the
            website to complete your purchase smoothly and securely.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ background: "#545151", color: "white" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          sx={{ color: "white" }}
        >
          <Typography>
            What is the difference between VoxaLinkPro and other AI service
            platforms?
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: "white", backgroundColor: "#353535" }}>
          <Typography>
            VoxaLinkPro stands out from other AI service platforms by its deep
            integration with the Ethereum blockchain, which provides enhanced
            security and transparency for all transactions. Our platform is not
            only user-friendly but also designed for both tech-savvy users and
            those new to the world of AI, making advanced AI services accessible
            to a broader audience. With VoxaLinkPro, users can not only use AI
            services but also contribute to the AI models' training process,
            earning $VXLP tokens in return. This creates a collaborative and
            rewarding ecosystem that fuels innovation and continuous growth.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
