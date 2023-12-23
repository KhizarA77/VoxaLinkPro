import { Grid } from "@mui/material"
import PdfDownload from "./PdfDownload"
import DocDownload from "./DocDownload"
import { motion } from 'framer-motion';
import { useState } from "react";

function DownloadBox({ selected, setSelected }) {
    const MotionGrid = motion(Grid);
    return (
        <>
            <Grid container columnGap={5} width={'100%'} style={{ justifyContent: 'center', display: "flex" }} >
                <Grid item>
                    <PdfDownload selected={selected} setSelected={setSelected} />
                </Grid>
                <Grid item>
                    <DocDownload selected={selected} setSelected={setSelected} />
                </Grid>
            </Grid>
        </>
    )
}

export default DownloadBox
