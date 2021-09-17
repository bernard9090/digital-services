import React, {useState} from "react";
import style from "../../styles/PinInput.module.css"
import PinInput from "react-pin-input";
import Button from "../Button";
import { PAGES } from "../../services/constants";
import { confirmSubscriptionAIRTELTIGO } from "../../services/restService";
import { useToasts } from "react-toast-notifications";

const PinInputComponent = (props: any) => {

    const {service, pid, keyword, attemptId,adId, header, redirect, asr} = props

    const [pin, setPin] = useState("")
    const [loading, setLoading] =useState(false)

    
    const {addToast} = useToasts()

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
                                                    setPin(pin)
                                                }}
                                            />

            <div style={{margin:"1rem 0"}}>
            <Button loading={loading} text="Confirm" onClick={()=> {
                if(pin !== ""){
                    setLoading(true)
                    confirmSubscriptionAIRTELTIGO(pin, header.msisdn, pid, keyword).then(({data})=>{
                        console.log(data)
                        if(data.code >= 400){
                            addToast("Error confirming your pin, check and try again", {
                                appearance:"error",
                                autoDismiss: true
                            })
                        }
                        props.redirect(asr)
                    }).catch(e => {
                        console.log(e)
                        addToast("Error confirming your pin, check and try again", {
                            appearance:"error",
                            autoDismiss: true
                        })
                    }).finally(()=> setLoading(false))
                }else{
                    addToast("Please enter your confirmation PIN", {
                        appearance:"info",
                        autoDismiss:true
                    })
                }
            }}/>
            </div>

            <span style={{color:"gray", cursor:"pointer"}} onClick={() => {props.navigate(PAGES.MAIN)}}>back</span>

            

        </div>
    )
}

export default PinInputComponent