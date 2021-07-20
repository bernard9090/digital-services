import React from "react"
import style from "../../styles/Button.module.css"

const Button = (props: any) => {


    const {onClick, loading} = props

    return (
        <button disabled={loading} onClick={onClick} className={style.sub_button}>
            {
                loading ? <span>please wait...</span> : <span>{props.text}</span>
            }
        </button>
    )

}

export default Button