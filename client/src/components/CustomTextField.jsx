import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import styles from "../styles/customText.module.scss"
import FolderIcon from '@mui/icons-material/Folder';
import Popover from '@mui/material/Popover';
import { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
function CustomInput({ filename, setStatus, abortController }) {
    const [anchorEl, setAnchorEl] = useState(null);
    if (filename.length > 42) {
        filename = filename.substring(0, 42) + '...';
    }

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (

        <>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: "flex-end", width: "100%", marginBottom: "-25px" }}><IconButton><InfoIcon aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose} sx={{ color: 'white' }} /></IconButton>
                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                        marginLeft: '20px',
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'right',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <div style={{
                        padding: "20px", borderWidth: "4px",
                        borderColor: 'darkmagenta',
                        backgroundColor: 'transparent'
                    }}>I use Popover.</div>
                </Popover>
            </Grid>
            <div class={styles.inputgroup}>
                <label class={`${styles.inputgroup__label}`} for="myInput">File name</label>
                <div type="text" id="myInput" className={styles.inputgroup__input}>
                    <Grid container>
                        <Grid item xs={11}>
                            <p>{filename}</p>
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
        </>
    )
}

export default CustomInput
