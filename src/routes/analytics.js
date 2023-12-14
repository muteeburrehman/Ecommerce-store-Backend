import express from "express";
import { db,queryDatabase } from "../DataBase/db";

export const analyticsRouter = express.Router();
// Endpoint: GET /api/analytics/sales
analyticsRouter.get ('/api/analytics/sales',async(req,res)=>{
    try{
    const query=`
    SELECT sales.sale_date,products.name,sales.quantity,sales.price
    FROM sales
    INNER JOIN products on sales.product_id=products.id
    `;
    const salesData = await queryDatabase(query)
    res.status(200).json(salesData)
    }
    catch(err){
    res.status(500).json({error:'An error occured while fetching sales data'})
    }
})
// Endpoint: GET /api/analytics/revenue
analyticsRouter.get('/api/analytics/revenue',async(req,res)=>{
    try{
        const query=`
        SELECT date ,total_revenue
        FROM
        revenue
        `;
        const revenueData= await queryDatabase(query)
        res.status(200).json(revenueData)
    }
    catch(err){
        res.status(500).json({error:'An error occured while fetching revenue data '})
    }
    
})