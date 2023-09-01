import express from 'express';
import { db,queryDatabase } from '../db';

export const salesRouter = express.Router();

/*
API ENDPOINT: GET /api/sales
Show all sales records
*/
salesRouter.get('/api/sales',async (req,res)=>{
    const query= `
    SELECT * FROM sales
    `;
    try{
        const result = await queryDatabase(query,[]);
        res.status(200).json(result)
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
});

/* 
API ENDPOINT: GET /api/sales/salesId
Show a specific sales record whose id match
*/
salesRouter.get('/api/sales/saleId',async(req,res)=>{
    const {saleId}= req.params
    const selectQuery= `
    SELECT * FROM sales
    WHERE sales_id= ?;
    `;
    try{
        const result= await queryDatabase(selectQuery,[saleId])
        if(!result || result.length ===0){
            res.status(404).json({message:'Sale does not exist'})
        }
        res.status(200).json (result[0])
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})
/* 
API ENDPOINT: POST /api/sales
For inserting a new sale record
*/
salesRouter.post('/api/sales',async(req,res)=>{
   
    const { product_id, sale_date, quantity, price}= req.body;
    const insertQuery=`
    INSERT INTO sales(product_id, sale_date, quantity, price)
    VALUES (?,?,?,?)
    `;
    const params= [product_id,sale_date,quantity,price]
    try{
       
        const result= await queryDatabase(insertQuery,params);
        res.status(200).json({message:'Sale created successfully',saleId:result.id})
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
});
/* 
API ENDPOINT: PUT /api/sales/saleId
For updating a  sale record
*/
salesRouter.put('/api/sales/saleId',async (req,res)=>{
    const {saleId}=req.params;
    const {product_id,sale_date,quantity,price}=req.body;
    const updateQuery=`
    UPDATE sales
    SET product_id=?,sale_date=?,quantity=?,price=?
    WHERE sale_id =?
    `;
    const params=[product_id,sale_date,quantity,price,saleId];
    try{
        await queryDatabase(updateQuery,params);
        res.status(200).json({message:'Sale updated successfully'})
    }catch (error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})
/*
API ENDPOINT: Delete /api/sales/saleId
For Deleting a  sale record
*/
salesRouter.delete('/api/sales/saleId',async (req,res)=>{
    const {saleId}=req.params;
    const deleteQuery=`
    DELETE FROM sales
    WHERE sale_id=?
    `;
    try{
        await queryDatabase(deleteQuery,[saleId])
        res.status(200).json({message:'Sale record deleted successfully'})
    }catch (error){
        console.error(error);
        res.status(500).json({message:'Internal server error'})
    }
})