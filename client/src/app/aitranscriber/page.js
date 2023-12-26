"use client"
import { Box, Button, Fab, Grid, Tooltip } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomTextField from '@/components/CustomTextField'
import { useDropzone } from 'react-dropzone';
import DownloadBox from "@/components/DownloadBox";
import CustomInput from "@/components/CustomInput";
import CustomerLoader2 from "@/components/CustomerLoader2";
import { purple, grey } from '@mui/material/colors';
import Typewriter from "typewriter-effect";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAccount } from "wagmi";
import CustomGoBtn from "@/components/CustomGoBtn";
import CustomAlert from "@/components/CustomAlert";
import VoxaLogo from "@/components/VoxaLogo";
import styles from "./page.module.css";
// Create an AbortController instance
const abortController = new AbortController();

// Get the AbortSignal from the controller
const abortSignal = abortController.signal;

function FileUpload({ onFileSelected, handleFileInputChange, visible, setVisible, errMsg, isConnected }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'audio/wav, audio/ogg, audio/x-m4a, audio/mpeg, video/mov, video/mpeg, video/mp4, video/avi, audio/opus, audio/aac, audio/flac, video/m4v',
        onDrop: onFileSelected
    });



    return (
        <div className="flex flex-col items-center" style={{ rowGap: '80px', marginTop: '-100px' }}>
            <div className={`flex ${styles.heading}`}>
                <div className={styles.voxaLogo}>
                    <VoxaLogo />
                </div>
                <h1 style={{}}>AI Transcriber  </h1>
            </div>
            <div className="Alert">
                <CustomAlert visible={visible} setVisible={setVisible} errMsg={errMsg} />
            </div>
            <div>
                {isConnected && <div {...getRootProps()} className="border-2 border-dashed p-5 flex items-center justify-center text-center text-custom text-white maxWidth-[1100px] minHeight-[100px]" style={{ borderColor: 'darkmagenta' }}>
                    <input {...getInputProps()} onChange={handleFileInputChange} />
                    {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some audio/video files here, or click to select files</p>}
                </div>}
                <p style={{ color: 'white', marginTop: "10px", textAlign: 'center', fontSize: '0.8em' }}>Please note that the AI Transcriber feature is currently in its alpha version and subject to ongoing enhancements. Your use of the AI Transcriber indicates acceptance of these terms and our data use policies as outlined in our Privacy Policy. <br></br><span style={{ color: 'red' }}><strong>NOTE:</strong> Only 1 use allowed per wallet</span> </p>
            </div>
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
        return false;
        // You may also highlight the input field or provide additional feedback
    }
}

const btnStyle = {
    color: 'common.white',
    marginTop: '20px',
    zIndex: 0,
    bgcolor: 'transparent',
    '&:hover': {
        bgcolor: grey[600],
    },
};


function Page() {
    const acceptedFormat = ["audio/wav", "audio/ogg", "audio/x-m4a", "audio/mpeg", "video/mov", "video/mpeg", "video/mp4", "video/avi", "audio/opus", "audio/aac", "audio/flac", "video/m4v"]
    const [Status, setStatus] = useState('idle');
    const [downloadLink, setDownloadLink] = useState('#');
    const [selected, setSelected] = useState('pdf')
    const [errMsg, setErrMsg] = useState('');
    const [email, setEmail] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [visible, setVisible] = useState(false);
    const { isConnected, address } = useAccount();
    const [isDone, setDone] = useState(false);
    const invisibleLinkRef = useRef(null);
    const [file, setFile] = useState('')

    useEffect(() => {
        if (!isConnected) {
            setErrMsg('Please connect a wallet to proceed.')
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [isConnected])

    const onFileSelected = (files) => {
        setVisible(false);
        if (acceptedFormat.includes(files[0].type)) {
            if (files[0].size / (1024 * 1024) > 100) {
                setErrMsg('file exceeds the limit of 100MB.');
                setVisible(true);
                setStatus('idle')
            } else {
                setStatus('uploaded')
                setFile(files[0])
            }
        } else {
            setErrMsg('Invalid format.')
            setVisible(true)
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
        }
    }, [Status]);


    async function startTranscribe() {
        if (!validateEmail(email)) {
            setIsEmail(false);
            return
        } else {
            setIsEmail(true);
            setDone(false);
            setStatus('processing')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('outputFormat', selected)
            formData.append('email', email)
            const res = await fetch('https://api.voxalinkpro.io/services/transcription/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData,
                signal: abortController.signal,
            })
            const data = await res.json();
            if (res.status === 200) {
                setStatus('completed')
                setDownloadLink(data.downloadLink)
            }
            if (res.status === 400) {
                setErrMsg(data.message)
                setVisible(true);
                setStatus('idle')
            }
            if (res.status === 401) {
                setErrMsg('Please reconnect your wallet')
                setVisible(true);
                setStatus('idle')
            }
            if (res.status === 500) {
                setErrMsg('Server side error. Please try again.')
                setVisible(true);
                setStatus('idle')
            }
        }
    }

    const handleFileInputChange = (e) => {
        const selectedF = e.target.files;
        if (selectedF.length > 0) {
            try {
                onFileSelected(selectedF);
            } catch (error) {
                console.error('File selection error:', error);
            }
        }
    };


    return (
        <>
            <div className="h-[100dvh] flex items-center justify-center  bg-[#000] z-0 relative overflow-hidden">
                {Status !== 'idle' && <Tooltip title="AI Transcriber Home" placement="right" arrow>
                    <div style={{ position: 'absolute', left: '25px', top: '100px' }}>
                        <Fab sx={btnStyle} onClick={() => {
                            abortController.abort({ reason: 'Back button clicked.' })
                            setStatus('idle')
                        }}>
                            <ArrowBackIcon fontSize="large" sx={{ color: 'white' }} /></Fab>
                    </div>
                </Tooltip>}
                <div div className="w-[95%] flex justify-center" >
                    <Grid xs={12} padding='10px' minHeight={'350px'} width={'1000px'} borderRadius={'20px'} rowGap={4} className={`bg-opacity-25 flex flex-col justify-center items-center backdrop-filter backdrop-blur-lg`} >

                        {Status === "idle" && <FileUpload isConnected={isConnected} visible={visible} setVisible={setVisible} errMsg={errMsg} onFileSelected={onFileSelected} handleFileInputChange={handleFileInputChange} />}
                        {Status === "processing" &&
                            <div className="flex flex-col items-center">
                                <CustomerLoader2 />
                                <p style={{ color: 'white', width: "280px", textAlign: 'center', fontSize: "0.75em", marginTop: "30px" }}>This may take a while. File will be emailed to you when done. Feel free to close the page.</p>
                            </div>
                        }
                        {Status === "uploaded" && <div width='800px' style={{ display: "flex", flexDirection: "column", rowGap: "30px", alignItems: "center" }}>
                            <CustomTextField filename={file.name} setStatus={setStatus} abortController={abortController} />
                            <CustomInput email={email} setEmail={setEmail} isEmail={isEmail} />
                            <DownloadBox selected={selected} setSelected={setSelected} />
                            <CustomGoBtn startTranscribe={startTranscribe} />
                        </div>
                        }
                        {Status === 'completed' &&
                            <>
                                <div className="flex flex-col">
                                    <div style={{ color: 'white', fontSize: '4rem' }}>
                                        <Typewriter onInit={(typewriter) => typewriter.typeString('Transcription Completed').pauseFor(1000).deleteAll().typeString('Download should start any second now..').start()
                                        } options={{ delay: 40 }} />
                                    </div>
                                    <a ref={invisibleLinkRef} href={downloadLink}></a>
                                    <a className={styles.downloadlink} href={downloadLink}>
                                        <Typewriter onInit={(typewriter) => typewriter.pauseFor(7800).typeString("Didn't start? ... Click Here").start()
                                        } options={{ delay: 40 }} />
                                    </a>
                                </div>
                            </>
                        }
                    </Grid>
                </div>
            </div>
        </>
    )
}

export default Page
