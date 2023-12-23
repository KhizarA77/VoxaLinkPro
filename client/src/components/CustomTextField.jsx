import styles from "../styles/customText.module.scss"
function CustomInput({ filename }) {
    return (
        <div class={styles.inputgroup}>
            <label class={`${styles.inputgroup__label}`} for="myInput">File name</label>
            <div type="text" id="myInput" class={styles.inputgroup__input}>
                <p>{filename}</p>
            </div>
        </div>
    )
}

export default CustomInput
