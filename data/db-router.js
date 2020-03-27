const express = require('express');
const Db = require('./db.js');

const router = express.Router();

// router.get('/', (req, res) => {
//     res.send(`
//       <h2>Day 2 Node Project</h>
//       <p>Welcome to the Lambda Hubs API D2</p>
//     `);
//   });


//



//POST new
router.post('/', (req, res) => {
    Db.insert(req.body)
    .then(newPost => {
        res.status(201).json(newPost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "There was an error while saving the post to the database"    
        })
    })
})







//GET All posts
router.get('/', (req, res) => {
    Db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: "Error retrieving DB"
        });
    });
});


//GET post by ID
router.get('/:id', (req, res) => {
    Db.findById(req.params.id)
    .then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist"});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "The post information could not be retreived"})
    });
})


//PUT 
router.put('/:id', (req, res) => {
    const update = req.body;
    Db.update(req.params.id, update)
        .then(post => {
            if(post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post information could not be modified."
            });
        });


});

//DELETE post
router.delete('/:id', (req, res) => {
    Db.remove(req.params.id)
    .then(count => {
        if(count > 0){
            res.status(200).json({ message: "the message has been deleted"});
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "The post could not be removed" });
    })
})




//POST comment
router.post('/:id/comments', (req, res) => {
    req.body.post_id = req.params.id;
    const text = req.body.text;
    const comment = req.body;

    if(!text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Db.insertComment(comment)
        .then(newId => {
                    Db.findCommentById(newId.id)
                    .then(comment => {
                            res.status(201).json(comment[0]);
                        })
                        .catch(err => {
                            console.log(err);
                        });
            })
            .catch(err => {
                console.log(err);
                err.errno === 19 ? 
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
                :
                res.status(500).json({ errorMessage: "There was an error while saving the comment to the database." });
            })};
});



// GET comments by post id 
router.get('/:id/comment', (req, res) => {
    const id = req.params.id;
    Db.findPostComments(id)
        .then(array => {
            if(!array[0]){
                res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(array)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The comments information could not be retrieved." })
        });
});

module.exports = router;



