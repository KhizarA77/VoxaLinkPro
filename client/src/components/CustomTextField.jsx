import { Grid, IconButton, Tooltip } from "@mui/material";
import styles from "../styles/customText.module.scss"
import FolderIcon from '@mui/icons-material/Folder';
import { useState } from "react";

function CustomInput({ filename, setStatus, abortController }) {

    return (
        <div class={styles.inputgroup}>
            <label class={`${styles.inputgroup__label}`} for="myInput">File name</label>
            <div type="text" id="myInput" className={styles.inputgroup__input}>
                <Grid container>
                    <Grid item xs={11}>
                        <p>{filename.substring(0, 42) + '...'}</p>
                    </Grid>
                    <Grid item xs={1} style={{ marginTop: "-10px" }}>
                        <Tooltip title="Change file" placement="right" arrow>
                            <IconButton onClick={() => {
                                abortController.abort({ reason: 'Change file button clicked' });
                                setStatus('idle');
                            }}>
                                <FolderIcon sx={{ color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>

                </Grid>

            </div>
        </div>
    )
}

export default CustomInput
