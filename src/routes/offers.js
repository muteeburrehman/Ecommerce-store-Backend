import express from 'express';
import { db,queryDatabase } from '../db';

export const offersRouter = express.Router()

//Create a Hot Offer
offersRouter.post('/offers',async(req,res)=>{
    const {title, description, startDate, endTime, discountPersent, productId,imageUrl}=req.body;

    const insertQuery=`
    INSERT INTO offers (title,description,startDate,endTime,discountPersent, productId,imageUrl)
    VALUES (?,?,?,?,?,?,?)
    `;
    try{
        await queryDatabase(insertQuery,[title,description,startDate,endTime,discountPersent,productId,imageUrl]);
        res.status(200).json({message:'Hot Offers created successfully'})
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
})

// Get ALL HOT Offers

offersRouter.get('/offers',async(req,res)=>{
    const selectQuery= `
    SELECT * FROM offers 
    `;
    try{
        const offers = await queryDatabase(selectQuery);
        res.status(200).json(offers)
    }catch(error){
        console.error(error)
        res.status(500).json({meessage:'Internal server error'})
    }
})

//Get offers by Id

offersRouter.get('/offers/:offerId',async(req,res)=>{
    const {offerId}=req.params;
    const selectQuery=`
    SELECT * FROM offer 
    WHERE offerId = ?
    `;
    try{
        const offers=await queryDatabase(selectQuery,[offerId])
        if(offers.length===0){
            res.status(404).json({meessage:'Offers not found'})
        }
        res.status(200).json(offers[0])
    }catch(error){
         console.error(error);
         res.status(500).json('Internal server error')
    }
})

//Update the offers

offersRouter.put('/offers/:offerId',async(req,res)=>{
    const {offerId}=req.params;
    const updatedOffer=req.body;
    const updatedQuery=`
    UPDATE offers SET ?
    WHERE offerId = ?
    `;
    try{
        const result=await queryDatabase(updatedQuery,[updatedOffer,offerId])
        if(result.affectedRows===0){
            res.status(404).json({message:'Offer not found'})
        }
        res.status(200).json({message:'Offer updated successfullt'})
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})

//Delete the offers

offersRouter.delete('/offers/:offerId',async(req,res)=>{
    const {offerId} = req.params;
    const deleteQuery=`
    DELETE FROM offers 
    Where offerId= ?
    `;
    try{
        const result = await queryDatabase(deleteQuery,[offerId])
        if(result.affectedRows===0){
            res.status(404).json({message:'Offer not found'})
        }
        res.status(200).json({message:'Offer deleted successfully'})
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})
