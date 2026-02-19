import { response } from "express";
import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";
export const generateImage = async (req, res) => {
    try{
        //code to generate image
        const { prompt, userId } = req.body;
        //fetch user
        const user = await userModel.findById(userId);
        //user exist or not
        //return what the missing detail is
        if(!user || !prompt){
            return res.json({success: false, message: {
                user: !user ? 'User not found' : null,
                prompt: !prompt ? 'Prompt is required' : null
            }});
        }

        //check user credits
        if(user.creditBalance <= 0 ){
            return res.json({success: false, message: 'Insufficient credits', 
                creditBalance: user.creditBalance});
        }

        //multipart form data for clipdrop api
        const formData = new FormData();
        formData.append('prompt', prompt);
        //api request using axios, post method
        const {data} =  await axios.post('https://clipdrop-api.co/text-to-image/v1',
            formData,{
                headers: {
                    'x-api-key': process.env.CLIPDROP_API,
                },
                responseType: 'arraybuffer',
            })
            //convert arraybuffer data to base 64
            const  base64Image = Buffer.from(data, 'binary').toString('base64');
            //generate image url
            const resultImage = `data:image/png;base64,${base64Image}`;

            //update user credit balance
            await userModel.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1});

            //send in response
            res.json({success: true, message:"Image generated" , creditBalance: user.creditBalance - 1,image: resultImage});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message });
    }
}
