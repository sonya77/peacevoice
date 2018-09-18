module.exports = function(app, Event)
{
    
    app.get('/api/test2', function(req,res){
        var aa = {"id":5, name:"jade", hobbies: new Array('a','b','c')
                 , characteristic: 
                  {
                     "good": {"f":"A", "s":"B", "t": 1234}
                     , "bad": {"f":"E", "s":"F", "t": 5678}                 
                 }};
        console.log(aa);       
        res.send(aa);       
    });    
    
    // GET ALL EVENTS
    app.get('/api/eventsAll', function(req,res){
        var condition = req.param.condition || req.query.condition;
        
        if(condition == 1){
            Event.find({}).sort({like: 'desc'}).exec(function(err, events){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(events);
        })            
        } else if(contion == 2){
              Event.find({}).sort({rpl_count: 'desc'}).exec(function(err, events){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(events);
        })
        } else{
            Event.find({}).sort({regdate: 'desc'}).exec(function(err, events){
                if(err) return res.status(500).send({error: 'database failure'});
                res.json(events);
            })
        }
    });

    // GET SINGLE EVENT
    app.get('/api/events/:title', function(req, res){
        Event.findOne({title: req.params.title}, function(err, event){
            if(err) return res.status(500).json({error: err});
            if(!event) return res.status(404).json({error: 'event not found'});
            res.json(event);
            //res.send(event);
        })
    });   

    // CREATE EVENT
    app.get('/api/eventsw', function(req, res){
        var event = new Event();
        event.title = req.body.title || req.param.title || req.query.title;
        event.subtitle = req.body.subtitle || req.param.subtitle || req.query.subtitle;
        event.content = req.body.content || req.param.content || req.query.content;
        event.content_detail = req.body.content_detail || req.param.content_detail || req.query.content_detail;
        event.certificate = req.body.certificate || req.param.certificate || req.query.certificate;
        event.like = req.body.like || req.param.like || req.query.like;
      

        event.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json({result: 1});

        });
    });

    // UPDATE THE EVENT
    app.put('/api/events/:event_id', function(req, res){
        Event.update({ _id: req.params.event_id }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            console.log(output);
            if(!output.n) return res.status(404).json({ error: 'event not found' });
            res.json( { message: 'event updated' } );
        })
    /* [ ANOTHER WAY TO UPDATE THE EVENT ]
            Event.findById(req.params.event_id, function(err, event){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!event) return res.status(404).json({ error: 'event not found' });

            if(req.body.title) event.title = req.body.title;
            if(req.body.author) event.author = req.body.author;
            if(req.body.published_date) event.published_date = req.body.published_date;

            event.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'event updated'});
            });

        });
    */
    });

    // DELETE EVENT
    app.delete('/api/events/:event_id', function(req, res){
        Event.remove({ _id: req.params.event_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "event not found" });
            res.json({ message: "event deleted" });
            */

            res.status(204).end();
        })
    });
     
}
