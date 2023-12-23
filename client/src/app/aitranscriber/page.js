"use client"
import { Box, Button, Fab, Grid, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import CustomTextField from '@/components/CustomTextField'
import { useDropzone } from 'react-dropzone';
import DownloadBox from "@/components/DownloadBox";
import CustomInput from "@/components/CustomInput";
import CustomerLoader2 from "@/components/CustomerLoader2";
import { purple, grey } from '@mui/material/colors';
import CustomPopUp from "@/components/CustomPopUp";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SettingsOutlined } from "@mui/icons-material";
// import Typed from 'react-typed';
import styles from '@/styles/downloadBtn.module.css'
// Create an AbortController instance
const abortController = new AbortController();

// Get the AbortSignal from the controller
const abortSignal = abortController.signal;

function FileUpload({ onFileSelected, handleFileInputChange }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'audio/wav, audio/ogg, audio/m4a, audio/mp3, video/mov, video/mpeg, video/mp4, video/avi, audio/opus, audio/aac, audio/flac, video/m4v',
        onDrop: onFileSelected
    });

    return (
        <div {...getRootProps()} className="border-2 border-dashed p-5 flex items-center justify-center text-center text-custom text-white maxWidth-[1100px] minHeight-[100px]" style={{ borderColor: 'darkmagenta' }}>
            <input {...getInputProps()} onChange={handleFileInputChange} />
            {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some audio/video files here, or click to select files</p>}
        </div>
    );
}

function validateEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;


    if (emailRegex.test(email)) {
        return true;
        // You can submit the form or perform other actions here
    } else {
        console.log('Invalid email address. Please enter a valid email.');
        return false;
        // You may also highlight the input field or provide additional feedback
    }
}

const btnStyle = {
    color: 'common.white',
    marginTop: '20px',
    zIndex: 0,
    bgcolor: purple[500],
    '&:hover': {
        bgcolor: grey[600],
    },
};


function Page() {
    const [transcribedText, setTranscribedText] = useState("");
    const acceptedFormat = ["audio/wav", "audio/ogg", "audio/m4a", "audio/mp3", "video/mov", "video/mpeg", "video/mp4", "video/avi", "audio/opus", "audio/aac", "audio/flac", "video/m4v"]
    const [Status, setStatus] = useState('idle');
    const [downloadLink, setDownloadLink] = useState('#');
    const [selected, setSelected] = useState('pdf')
    const [email, setEmail] = useState('');
    const [isDone, setDone] = useState(false);
    const invisibleLinkRef = useRef(null);
    const [file, setFile] = useState('')
    const MotionGrid = motion(Grid);
    const onFileSelected = (files) => {
        if (acceptedFormat.includes(files[0].type)) {
            console.log('Accepted Format')
            setStatus('uploaded')
            setFile(files[0].name)
            setTranscribedText('File uploaded');
        } else {
            console.log('Rejected Format')
        }
    };

    useEffect(() => {
        // Ensure the ref is not null before attempting to set properties
        if (invisibleLinkRef.current) {
            invisibleLinkRef.current.style.display = 'none';
            invisibleLinkRef.current.href = downloadLink;
            setTimeout(() => {
                invisibleLinkRef.current.click();
            }, 7500)
            console.log('btn found')
        } else {
            console.log('No btn')
        }
    }, [Status]);


    async function startTranscribe(email, file, format) {
        if (!validateEmail(email)) {
            console.log('Error: Invalid Email')
            return
        } else {
            setDone(false);
            setStatus('processing')
            const formData = { file: file, outputFormat: format, email: email };
            try {

                const res = await fetch('http://localhost:4000/services/transcription/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                    signal: abortController.signal,
                })
                const data = await res.json();
                if (data) {
                    setStatus('success')
                    setDownloadLink(data.downloadLink)
                    setTimeout(() => {
                        setStatus('completed')
                    }, 5000)
                }
                if (!data || !res.ok) {
                    console.log("Error transcribing the file.")
                    setStatus('idle')
                }
            } catch (err) {
                console.log(err)
                setStatus('idle')
            }
        }
    }

    const handleFileInputChange = (e) => {
        const selectedF = e.target.files;
        if (selectedF.length > 0) {
            try {
                onFileSelected(selectedF);
                console.log("selected file using selection: ", selectedF)
            } catch (error) {
                console.error('File selection error:', error);
            }
        }
    };

    {/* <Box width={'100%'} height={'100px'} sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    multiple={false}
                                />
                                <a title="Upload audio file to be transcribed - Voxalink Pro" href="#" onClick={handleUploadClick} style={{ color: 'white', fontSize: '1.5rem', display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                                    <CloudUploadIcon sx={{ scale: '5', marginBottom: "40px" }} />

                                    Upload File</a>
                            </Box> */}

    return (
        <>
            <div className="h-[100dvh] flex items-center justify-center  bg-[#000] z-0 relative overflow-hidden">
                <Tooltip title="AI Transcriber Home" placement="right" arrow>
                    <div style={{ position: 'absolute', left: '25px', top: '100px' }}>
                        <Fab sx={btnStyle} onClick={() => setStatus('idle')}>
                            <ArrowBackIcon fontSize="large" sx={{ color: 'white' }} /></Fab>
                    </div>
                </Tooltip>
                {/* <div className="hidden md:block absolute w-[50rem] h-[50rem] opacity-70 bg-[#b63fc9] rounded-full blur-[20rem] top-[-18rem] left-[-30rem]"></div> */}
                <div div className="w-[95%] flex justify-center" >
                    <Grid xs={12} padding='10px' minHeight={'350px'} width={'1000px'} borderRadius={'20px'} rowGap={4} className={`bg-opacity-25 flex flex-col justify-center items-center backdrop-filter backdrop-blur-lg`} >

                        {Status === "idle" && <FileUpload onFileSelected={onFileSelected} handleFileInputChange={handleFileInputChange} />}
                        {Status === "processing" && <CustomerLoader2 />}
                        {Status === "uploaded" && <div width='800px' style={{ display: "flex", flexDirection: "column", rowGap: "30px" }}>
                            <CustomTextField filename={file} />
                            <CustomInput email={email} setEmail={setEmail} />
                            <DownloadBox selected={selected} setSelected={setSelected} />
                            <Button onClick={() => {
                                startTranscribe(email, file, selected)
                            }}>Go</Button>
                        </div>
                        }
                        {Status === 'completed' &&
                            <>

                                <div style={{ color: 'white', fontSize: '4rem' }}>
                                    {/* <TypeAnimation sequence={['Transcription Completed', 'Download should start any second now..']} wrapper="h1" speed={50} />
                             */}
                                    {/* <Typed strings={['Transcription Completed', 'Download Should Start Any Second Now..']} */}
                                        {/* typeSpeed={55}
                                        backSpeed={25}
                                        backDelay={1000}
                                    /> */}
                                </div>
                                <a ref={invisibleLinkRef} href={downloadLink} onClick={() => console.log('Download Button Was Clicked')}></a>
                                <div style={{ color: 'white', fontSize: '1rem' }}>
                                    {/* <Typed strings={['Having trouble downloading? ... CLICK ME']}
                                        typeSpeed={55}
                                        backSpeed={25}
                                        startDelay={7000}
                                        showCursor={false}
                                    >
                                        <a className={styles.downBtn} href={downloadLink} onClick={() => console.log('Download Button Was Clicked')}></a>
                                    </Typed> */}
                                </div>
                            </>
                        }
                    </Grid>
                    {/* <UploadBox status={Status} transcribedText={transcribedText} fileInputRef={fileInputRef} handleFileChange={handleFileChange} handleUploadClick={handleUploadClick} /> */}

                    {/* <Grid item xs={12} padding='10px' sx={{ borderWidth: '2px', borderColor: "darkmagenta" }} borderRadius={'20px'} height={'550px'} className={`bg-gray-600 bg-opacity-25 text-white backdrop-filter backdrop-blur-lg`}>

                            {Status === 'idle' &&
                                <h1 title="transcribed text - Voxalink Pro">Upload a file to be transcribed</h1>
                            }
                            {Status === 'processing' && <TypeAnimation sequence={[transcribedText]} wrapper="h1" speed={50} />}
                            {Status === 'completed' && <TypeAnimation sequence={[transcribedText]} wrapper="h1" speed={50} />}
                        </Grid> */}
                </div>
            </div>
        </>
    )
}

export default Page
