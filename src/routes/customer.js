import express from 'express'
import { db,queryDatabase } from '../db'

export const customersRouter = express.Router();

customersRouter.get('/api/customers',async (req,res)=>{
    const query = `
    SELECT * FROM customers
    `;
    try{
        const result = await queryDatabase(query,[]);
        res.status(200).json(result)
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
});

customersRouter.get('/api/customers/:customerId',async (req,res)=>{
    const {customerId}=req.params;
    const query=`
    SELECT * FROM customers 
    WHERE id = ?
    `;
    try{
        const result = await queryDatabase(query,[customerId])
        if(result.length===0 && !result)
        {
            res.status(404).json('There are no customers with this id')
        }
        res.status(200).json(result)
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})