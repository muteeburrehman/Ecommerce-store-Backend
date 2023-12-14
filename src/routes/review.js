import express from "express";
import {queryDatabase} from "../DataBase/db";

export const reviewRouter = express.Router();

reviewRouter.get('/api/categories/:categoryId/reviews',async (req,res)=>{
    const {categoryId}=req.params;
    try{
        const query=`
        SELECT * FROM reviews
        WHERE category_id=?
        `;
        const reviewData=await queryDatabase(query,[categoryId])
        res.status(200).json(reviewData)
    }catch (err){
        res.status(500).json('DataBase error')
    }
})

reviewRouter.get('/api/categories/:categoryId/reviews/:reviewId',async (req,res)=>{
    const {categoryId,reviewId}=req.params;
    try{
        const query=`
        SELECT * from reviews 
        where category_id= AND id=?
        `;
        const reviewData =await queryDatabase(query,[categoryId,reviewId])
        if(!reviewData.length){
            res.status(404).json('Review not found')
            return
        }
        res.status(200).json(reviewData[0])
    }catch (err){
        res.status(500).json('DataBase error')
    }
});

reviewRouter.post('/api/categories/:categoryId/reviews/:userId',async (req,res)=>{
    const{categoryId,userId}=req.params
    const {rating,comment}=req.body;
    try{
        const query=`
        INSERT into review (category_id,user_id,rating,comment)
        values(?,?,?,?)
        `;
        await queryDatabase(query,[categoryId,userId,rating,comment]);
        res.status(200).json({message:'Review added successfully'});
    }catch (err){
        res.status(500).json('DataBase error');
    }
})

reviewRouter.put('/api/categories/:categoryId/reviews/:reviewId/:userId',async (req,res)=>{
    const {categoryId,reviewId,userId}=req.params;
    const {rating,comment}=req.body;

    try {
        const query=`
        UPDATE reviews
        SET rating=?,comment=?
        WHERE category_id=? AND id=? AND user_id =?
        `;
        await queryDatabase(query,[rating,comment,categoryId,reviewId,userId])
        res.status(200).json({message:'Product updated successfully'})
    }catch (err){
        res.status(500).json({error:'DataBase error'})
    }
});

reviewRouter.delete('/api/categories/:categoryId/reviews/:reviewId/:userId', async (req, res) => {
    const { categoryId, reviewId, userId } = req.params;
    try {
        const query = `
            DELETE FROM reviews
            WHERE category_id=? AND id=? AND user_id=?
        `;
        await queryDatabase(query, [categoryId, reviewId, userId]);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'DataBase error' });
    }
});
