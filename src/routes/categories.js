import express from "express";
import {db,queryDatabase} from "../db";

export const categoryRouter=express.Router();

//Endpoint: GET /api/categories
categoryRouter.get('/api/categories',async ( req,res)=>{
    try{
        const query =`
        SELECT * FROM categories,[]
        `;
        const categoryData =await queryDatabase(query)
        res.status(200).json(categoryData)
    }catch (err){
        console.error('DataBase query error:',err)
        res.status(500).json({error:'Database Error'})
    }
})

//Endpoint: GET /api/categories/categoryId
categoryRouter.get('/api/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const query = `
            SELECT * FROM categories
            WHERE id = ?
        `;
        const CategoryData = await queryDatabase(query, [categoryId]); // Passing categoryId as a parameter
        if (!CategoryData) {
            res.status(404).json('There is no such category');
        } else {
            res.json(CategoryData); // Send the retrieved category data in the response
        }
    } catch (err) {
        res.status(500).json({error:'DataBase error'});
    }
});
//EndPoint: Post /api/categories
categoryRouter.post('/api/categories',async (req,res)=>{
    const{name,description}=req.body;
    try{
        const query=`
        INSERT INTO categories (name,description)
        VALUES (?,?)
        `;
        const categoryData = await queryDatabase(query,[name],[description])
        res.status(200).json(categoryData)
    }catch (err){
        res.status(500).json({error:'DataBase Error'})
    }
})
//EndPoint: PUT /api/categories/categoryId
categoryRouter.put('/api/categories/categoryId',async (req,res)=>{
    const {categoryId}=req.params;
    const {name,description}=req.body;
    try{
        const query = `
        UPDATE categories 
        SET name=?,description=?
        WHERE id =?
        `;
        const categoryData=await queryDatabase(query,[name,description,categoryId])
        res.status(200).json(categoryData)
    }catch (err){
        console.error('DataBase error:',err)
        res.status(500).json({error:'DataBase Error'})
    }
})

categoryRouter.delete('/api/categories/categoryId',async (req,res)=>{
    const {categoryId}=req.params;
    try{
        const query =`
        DELETE FROM categories 
        WHERE id = ?
        `;
        const categoryData=await queryDatabase(query,[categoryId])
        res.status(200).json(categoryData)
    }catch (err){
        console.error('DataBase error:',err)
        res.status(500).json({error:'DataBase error'})
    }
})