import express from "express";
import {db, queryDatabase} from '../db';
import passport from "passport";

export const ordersRouter= express.Router();
// Get the list of all orders 
ordersRouter.get('/api/orders',async (req,res)=>{

    try {
        const rows= await queryDatabase('SELECT * FROM ORDERS',[]);
        res.status(200).json(rows)
    }
    catch(err){
        res.status(500).json({error:'DataBase Error'})
    }
})
//Get the details of a specific order
ordersRouter.get('/api/orders/:orderId',async (req,res)=>{
    const {orderId}=req.params;
    try{
        const rows= await queryDatabase('Select * FROM ORDERS WHERE id = ?',[orderId]);
        if(!rows){
            res.status(404).json('Could not find the product')
            return
        }
        res.status(200).json(rows)
    }
    catch(err){
        res.status(500).json({error:'Database error'})
    }
})
//Update the details of a specific order
ordersRouter.put('/api/orders/:orderId',async (req,res)=>{
    const {orderId}=req.params;
    const {order_status,total_amount,shipping_address,billing_address,order_date,}=req.body;

    const updateQuery = `
    UPDATE orders
    SET order_status = ?, total_amount = ?, shipping_address = ?, billing_address = ?, order_date = ?
    WHERE id = ?
  `;
    db.run(updateQuery,[order_status,total_amount,shipping_address,billing_address,order_date,orderId],(err)=>{
    if(err){
        console.error(err.message);
        res.status(500).json({err:'Failed to update order'})
    } else {
        res.status(200).json({message:'Order updated successfully'})
    }
    });
});
//Delete the specific order
ordersRouter.delete('/api/orders/:orderId',async (req,res)=>{
    const {orderId} =req.params;

    const deleteQuery=`
    DELETE FROM ORDERS 
    WHERE id=?
    `;
    
    db.run(deleteQuery,[orderId],(err)=>{
        if(err){
            console.error(err.message);
            res.status(500).json({err:'Failed to delete the order'})
        } else {
            res.status(200).json({message:'Order deleted successfully'})
        }
    })
})