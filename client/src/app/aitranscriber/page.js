"use client"
import { Box, Button, Grid } from "@mui/material";
import React, { useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import styles from './page.module.css'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import MascotCanvas from "@/components/Mascot";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function Page() {
    const fileInputRef = useRef(null);
    const [transcribedText, setTranscribedText] = useState("");
    const MotionGrid = motion(Grid);
    const handleUploadClick = () => {
        // Trigger click on the hidden file input
        setTranscribedText("File uploaded")
        setTimeout(() => {
            // setValue(true);
        }, 2000)
        console.log(transcribedText)
        // fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // Do something with the selected file, e.g., upload it
        console.log('Selected File:', selectedFile);
    };

    return (
        <div className="h-[100dvh] flex items-center justify-center  bg-[#17181d] z-0 relative overflow-hidden">
            <div className="hidden md:block absolute w-[50rem] h-[50rem] opacity-70 bg-[#b63fc9] rounded-full blur-[20rem] top-[-18rem] left-[-30rem]"></div>
            <div className="h-[85dvh] w-[95%] flex justify-center">
                <Grid container gap={4} sx={{ height: '800px', width: "70%", padding: '20px', display: 'flex', justifyContent: 'center' }}>
                    <Grid container xs={12} md={7} rowGap={2}>
                        <MotionGrid container xs={12} rowGap={2} initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                            <Grid item xs={12} padding='10px' borderRadius={'20px'} height={'200px'} className={`bg-gray-600 bg-opacity-25 flex items-center justify-center backdrop-filter backdrop-blur-lg`} >
                                <Box width={'100%'} height={'100px'} sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        multiple={false}
                                    />
                                    <a href="#" onClick={handleUploadClick} style={{ color: 'white', fontSize: '1.5rem', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                                        <CloudUploadIcon sx={{ scale: '5', marginBottom: "40px" }} />

                                        Upload File</a>
                                </Box>
                            </Grid>
                        </MotionGrid>
                        <MotionGrid container xs={12} rowGap={2} initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                            <Grid item xs={12} padding='10px' sx={{ borderWidth: '2px', borderColor: "darkmagenta" }} borderRadius={'20px'} height={'550px'} className={`bg-gray-600 bg-opacity-25 text-white backdrop-filter backdrop-blur-lg`}>
                                {transcribedText === "" ?
                                    <h1>Upload a file to be transcribed</h1>
                                    : <TypeAnimation sequence={[transcribedText]} wrapper="h1" speed={50} />}
                            </Grid>
                        </MotionGrid>
                    </Grid>
                    <Grid container md={4} >
                        <MotionGrid container xs={12} rowGap={2} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} borderRadius={'20px'} transition={{ duration: 0.4, delay: 0.6 }} className={`bg-gray-600 bg-opacity-25 text-white backdrop-filter backdrop-blur-lg`}>
                            <Grid item xs={12} className="flex justify-center" padding='10px' borderRadius={'20px'} height={{ xs: '300px', md: '100%' }} >
                                <h1> Download Button </h1>
                                <div className="absolute top-[300px] w-[800px] h-[800px]">
                                    <MascotCanvas />
                                </div>
                            </Grid>
                        </MotionGrid>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Page
