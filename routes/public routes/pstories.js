const express = require('express')
const router = express.Router()

// Loading Story model for public stories
const Story = require('../../models/Story')


// taking the guest to read a single story
router.get('/:id', async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).populate('user').lean()

      const requestPostId = req.params.id;
      let comments = story.comments
      let date = story.createdAt.toDateString();
      if (!story) {
        return res.render('error/500')
      }

     await Story.findOneAndUpdate({_id: requestPostId}, {$inc: {visits: 1}}, (err,post)=>{
        res.render('public/showpstory', {
          layout: 'public',
          story,
          vis: post.visits + 1,
          comments,
          date,
        })
      })
     
      
    } catch (err) {
      console.error(err)
      res.render('error/public_error/404')
    }
  })

// POSTS COMMENT 
  router.post('/posted/:storyId/:userName', (req,res)=>{
    let post_id = req.params.storyId
    let username = req.params.userName
    Story.findOneAndUpdate({_id: post_id}, { $push: {comments: {"username": username, "comment": req.body.comment}}}, (err,post)=>{
        console.log(err);
    })
})

// Route to read only comments of a single post
router.get('/:id/comments', async (req,res)=>{
try {
    let post = await Story.findById(req.params.id).populate('user').lean();

    let comments = post.comments
    res.render('public/readComments', {
      layout: 'public',
      post,
      comments, 
    })
  } catch (err) {
    console.error(err)
    res.render('error/public_error/404')
  }
})

module.exports = router
