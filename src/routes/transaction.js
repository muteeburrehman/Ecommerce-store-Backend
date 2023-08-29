import express from "express";
import {db,queryDatabase} from "../db";

export const transactionRouter=express.Router();

// Create a Transaction
transactionRouter.post('/api/transactions',async (req,res)=>{
    const{customerId,products,paidAmount,paymentMethod}=req.body;

    const createdTime = new Date().toISOString();

    const insertQuery = `
    INSERT INTO transactions (customerId,paidAmount,paymentMethod,createdTime)
    values (?,?,?,?)
    `;
    try {
        const result = await queryDatabase(insertQuery,[customerId,paidAmount,paymentMethod,createdTime])

        //Assuming result.insertId contains the new transactionId
        const newTransaction = {
            transactionId:result.insertId,
            customerId,
            paidAmount,
            paymentMethod,
            createdTime,
            products:[]
        };
        res.status(201).json(newTransaction);
    }catch (error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})
//Get transaction details
transactionRouter.get('/api/transactions/:transactionId',async (req,res)=>{
    const {transactionId}=req.params;
    const selectQuery=`
    SELECT * from transactions
    WHERE transactionId =?
    `;
    try {
        const result = await queryDatabase(selectQuery,[transactionId]);

        if(result.length==0 && !result){
            return res.status(404).json({message:'Transaction not found'})
        }
        const transaction = result[0];

        res.status(200).json(transaction);
    }catch (error){
        console.error(error)
        res.status(500).json('Internal server error')
    }
})
//List Transaction
transactionRouter.get('/api/transactions/',async (req,res)=>{
    const selectQuery=`
    SELECT * FROM transactions
    `;
    try{
        const transaction=await queryDatabase(selectQuery)
        res.status(200).json(transaction)
    }catch (error){
        res.status(500).json({message:'Internal server error'})
    }
})
//Update Transaction
transactionRouter.put('/api/transactions/transactionId',async (req,res)=>{
    const {transactionId}=req.params;
    const updatedTransaction=req.body;

    const updatedQuery=`
    UPDATE transactions 
    SET ?
    WHERE transactionId = ?
    `;

    try {
        const result =await queryDatabase(updatedQuery,[updatedTransaction,transactionId]);
        if (result.affectedRows===0){
            return res.status(404).json({message:'Transaction not found'})
        }
        res.status(200).json(updatedTransaction)
    }catch (error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
});
//Delete Transaction
transactionRouter.delete('/api/transactions/transactionId',async (req,res)=>{
    const {transactionId}=req.params;

    const deletedQuery=`
    DELETE FROM transactions 
    WHERE transactionId=?
    `;
    try {
        const result=await queryDatabase(deletedQuery,[transactionId]);
        if (result.affectedRows===0){
            return res.status(404).json({message:'Transaction not found'})
        }
        res.status(204);
    }catch (error){
     console.error(error);
     res.status(500).json({message:'Internal server error'})
    }
});