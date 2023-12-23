import styles from "../styles/customInput.module.scss"
function CustomInput({ email, setEmail }) {
    return (
        <div class={styles.inputgroup}>
            <input type="text" id="myInput" class={styles.inputgroup__input} value={email} onChange={(e) => {
                setEmail(e.target.value)
            }} placeholder="Enter your email" />
        </div>
    )
}

export default CustomInput
