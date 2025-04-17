import axios from 'axios';
import dotenv from 'dotenv';

export const getTemplate = async(req,res)=>{

  try{
    const response = await axios.get(
      "https://partner.gupshup.io/partner/app/7f97d76e-d64a-4c7b-b589-7b607dce5b45/templates",
      {
        headers: {
          accept: "application/json",
          Authorization: process.env.app_token,
        },
      }
    );
    return res.status(200).json(response.data);
  }catch(error){
    return res.status(500).json({error : error.message});
  }

}