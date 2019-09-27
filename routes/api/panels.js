
const express = require('express');
const router = express.Router();
const Panel = require('../../models/Panel');
// const AWS = require('aws-sdk');
// const { aws } = require('../../config/keys');
const validatePanel = require('../../validation/panel');

// const { aws_access_key_id, aws_secret_access_key, sw3_bucket } = aws;

// configure aws
// aws.config.region = 'us-west-2';

router
    .get('/:id', (req, res) => {
        Panel.findById(req.params.id).then((panel) => {

            const { _id, authorId, title, panelText, photoURL, parentId, rootId, childIds } = panel;

            res.json({
                id: _id,
                authorId,
                title,
                panelText,
                photoURL,
                parentId,
                rootId,
                childIds
            });

        });
    })


  .post('/', (req, res) => {
    const { errors, isValid } = validatePanel(req.body);

        if (!isValid) {
            res.status(422).json(errors);

        }  else {
            const { authorId, title, panelText, photoURL, parentId, rootId, childIds } = req.body;

            const newPanel = new Panel({
                authorId,
                title,
                panelText,
                parentId,
                rootId,
                photoURL,
                childIds
            });


            newPanel.save()
                .then(panel => {
                    const { _id, authorId, title, panelText, photoURL, parentId, rootId, childIds } = panel;
                    const payload = {
                        id: _id,
                        authorId,
                        title,
                        panelText,
                        parentId,
                        rootId,
                        photoURL,
                        childIds
                    };
                    res.json(payload);
                })
                .catch(err => console.log(err));


        

        // const fileName = req.query['file-name'];
        // const fileType = req.query['file-type'];
        // const s3Params = {
        //     Bucket: sw3_bucket,
        //     Key: fileName,
        //     Expires: 60,
        //     ContenType: fileType,
        //     ACL: 'pubic-read'
        // };

        // s3Params.getSignedUrl('putObject', s3Params, (err, data) => {
        //     if (err) {
        //         console.log(err);
        //         return res.end();
        //     }
        //     const returnData = {
        //         signedRequest: data,
        //         url: `https://${sw3_bucket}.s3.amazonaws.com/${fileName}`
        //     };
        //     res.write(JSON.stringify(returnData));
        //     res.end();
        // });
            }
    })
    .patch('/:id', (req, res) => {
        const { errors, isValid } = validatePanel(req.body);

        if (!isValid) {
            res.status(422).json(errors);
        } else if (req.params.id === req.body.id) {

            Panel.findById(req.params.id).then(() => {
                const { id, authorId, title, panelText, photoURL, parentId, rootId, childIds } = req.body;

                const updatedPanel = new Panel({
                    _id: id,
                    authorId,
                    title,
                    panelText,
                    parentId,
                    rootId,
                    photoURL,
                    childIds
                });
                updatedPanel.isNew = false;
                updatedPanel.save()
                    .then(panel => {
                        const { _id, authorId, title, panelText, photoURL, parentId, rootId, childIds } = panel;
                        const payload = {
                            id: _id,
                            authorId,
                            title,
                            panelText,
                            parentId,
                            rootId,
                            photoURL,
                            childIds
                        };
                        res.json(payload);
                    })
                    .catch(err => console.log(err));

            });
            // check if it already exists
            // check if it already exists
            // save it
            // return it
            
            
        }
    })
    .get('/', (req, res) => {
        if (req.query.panelsArray){
           
            Panel.find({_id: {$in: req.query.panelsArray}}, (err, panelsArray) => {
                const panelsToReturnPojo = {};
                panelsArray.forEach(panel => {
                    const { _id, authorId, title, panelText, photoURL, parentId, rootId, childIds } = panel;
                    const RestructuredPanel = {
                        id: _id,
                        authorId,
                        title,
                        panelText,
                        parentId,
                        rootId,
                        photoURL,
                        childIds
                    };
                    panelsToReturnPojo[RestructuredPanel.id] = RestructuredPanel;
                });
                res.send(panelsToReturnPojo);
            })


        }else {
            Panel.find({}, (err, panelsArray) => {
                const panelsToReturnPojo = {};
                panelsArray.forEach(panel => {
                    const { _id, authorId, title, panelText, photoURL, parentId, rootId, childIds } = panel;
                    const RestructuredPanel = {
                        id: _id,
                        authorId,
                        title,
                        panelText,
                        parentId,
                        rootId,
                        photoURL,
                        childIds
                    };
                    panelsToReturnPojo[RestructuredPanel.id] = RestructuredPanel;
                });
                res.send(panelsToReturnPojo);
            })
        }
        
    })
module.exports = router;
