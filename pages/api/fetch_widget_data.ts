import axios, {} from "axios";
import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'


const url = process.env.HOST

export default  (req: NextApiRequest,
    res: NextApiResponse<any>) => {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()


    console.log(serverRuntimeConfig.secret)
    console.log(req.body)
    res.status(200).json({ name: 'John Doe' })

}