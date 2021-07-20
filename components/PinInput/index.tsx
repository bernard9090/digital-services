import React from "react";
import style from "../../styles/PinInput.module.css"
import PinInput from "react-pin-input";


const PinInputComponent = (props: any) => {

    return(
        <div className={style.pin_container}>

            <p>Please enter your confirmation Pin</p>

            <PinInput
                 length={4}
                 focus
                  inputStyle={{
                                                    width: 40,
                                                    height: 40,
                                                    background: "#F8F8F8",
                                                    border: "1px solid #E3E3E3",
                                                    boxSizing: "border-box",
                                                    borderRadius:4,
                                                    fontSize:20,
                                                    margin:"8px"
                                                }}
                                                type="numeric"
                                                onChange={(pin) => {

                                                }}
                                            />

            <button className={style.pin_confirm_btn}>Confirm</button>

            

        </div>
    )
}

export default PinInputComponent