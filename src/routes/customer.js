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

//Create a new customer
customersRouter.post('/api/customers',async (req,res)=>{
  const {user_id, first_name, last_name, email, phone_no, birthdate, gender, address}= req.body;
  const insertQuery= `
  Insert INTO customers (user_id, first_name, last_name, email, phone_no, birthdate, gender, address)
  VALUES (?,?,?,?,?,?,?,?)
  `;
  const params =[user_id, first_name, last_name, email, phone_no, birthdate, gender, address]
  try{
    const result = await queryDatabase (insertQuery,params);
    res.status(200).json(result);
  }catch(error){
    console.error(error);
    res.status(500).json({message:'Internal server error'})
  }
});

//Update customers

customersRouter.put('/api/customers/:customerId',async (req,res)=>{
    const customerId =req.params;
    const {first_name, last_name, email, phone_no, birthdate, gender, address}=req.body;
    const updateQuery=`
    UPDATE customers
    SET first_name= ?, last_name= ?, email= ?, phone_no= ?, birthdate= ?, gender= ?, address= ?
    where id = ?
    `;
    const params=[first_name, last_name, email, phone_no, birthdate, gender, address,customerId];
    
    try{
        const result= await queryDatabase (updateQuery,params);
        res.status(200).json(result);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
});

//Delete customers

customersRouter.delete('/api/customers/:customersId')