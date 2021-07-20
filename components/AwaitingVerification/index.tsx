import React from 'react'

const AwaitingVerification = (props:any) => {


    return (
        <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
        }}>
            <p style={{textAlign:"center" }}>Your subscription is being processed. If you didn't receive any USSD prompt, Please dial *175# and send 2 to confirm.</p>


        </div>
    )

}

export default AwaitingVerification