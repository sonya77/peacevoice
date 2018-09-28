module.exports = function(app, Event, Reply, Mem, Feel, Ecounter)
{   //파일첨부 하던중
    /*
    const multer = require('multer');
    // 기타 express 코드
    const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
    app.post('/up', upload.single('img'), (req, res) => {
      console.log(req.file); 
    }); */
    
    //Test api
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
        var condition = req.params.condition || req.query.condition;
       

        
        
        if(condition == 1){//인기순 조회
            Event.find({}).sort({like: 'desc'}).exec(function(err, events){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(events);
        })            
        } else if(condition == 2 ){//댓글순 조회
              Event.find({}).sort({rpl_count: 'desc'}).exec(function(err, events){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(events);
        })
        } else{//최신순 조회
            Event.find({}).sort({regdate: 'desc'}).exec(function(err, events){
                if(err) return res.status(500).send({error: 'database failure'});
                res.json(events);
            })
        }
    });

    // GET SINGLE EVENT
    app.use('/api/eventsOne', function(req, res){
        var pid = req.params.pid || req.query.pid;  
        var device_id = req.params.device_id || req.query.device_id;  
        var data1 = null, data2 = null, date3 = null; // @null아니면? undefined
        var resultData = new Object();
        
        Event.findOne({pid: pid}, function(err, event){
            if(err) return res.status(500).json({error: err});
            if(!event) return res.status(404).json({error: 'event not found'});
            
            data1 = event;
            resultData.data1 = data1;
            
            Reply.find({pid: pid}).sort({regdate: 'desc'}).exec(function(err, event){
                data2 = event;         
                resultData.data2 = data2;                
                
                Feel.findOne({pid: pid, device_id: device_id }).exec(function(err, event){//, device_id: device_id
                    data3 = event;         
                    resultData.data3 = data3;            
                    console.log(resultData);
                    res.json(resultData);
                })  
            })  
        })
     }); 
        // No use
        /*
        Event.findOne({pid: pid}, function(err, event){
            if(err) return res.status(500).json({error: err});
            if(!event) return res.status(404).json({error: 'event not found'});
            data1 = event;
            res.json(data1);
            //resultData.aa = data1;
            //res.send(event);
        })
        
        Reply.find({pid: pid}).exec(function(err, event){
           // console.log(event);
            data2 = event;
            console.log("!====! 왜 저장이 !===! "+data2);          
            resultData.bb = data2;
        }) */        
     

    
    //SEARCH EVENT
      app.get('/api/searchEvent', function(req,res){
        var keyword = req.params.keyword || req.query.keyword || "";// console.log("!=="+keyword);
          //검색어 없이 조회할시, 전체 최신순 검색 결과
          if ( keyword=="" || keyword == null ){
                Event.find({}).sort({regdate: 'desc'}).exec(function(err, events){
                if(err) return res.status(500).send({error: 'Error!'});
                res.json(events);
                })              
          }
          else { //검색어가 title, subtitle에 들어간 게시물 조회
               Event.find({ $or: [ {title: {$regex: keyword}}, {subtitle: {$regex: keyword }}] }).exec(function(err, events){
                        if(err) return res.status(500).send({error: 'Error!'});
                        console.log("!!!"+events);
                        res.json(events);  
                })
          }
    });
      
    
    // CREATE(INSERT) EVENT
    app.use('/api/eventsWrite', function(req, res){
        var event = new Event();
        event.pid = req.body.pid || req.params.pid || req.query.pid;
        event.title = req.body.title || req.params.title || req.query.title;
        event.subtitle = req.body.subtitle || req.params.subtitle || req.query.subtitle;
        event.content = req.body.content || req.params.content || req.query.content;
        event.content_detail = req.body.content_detail || req.params.content_detail || req.query.content_detail;
        event.certificate = req.body.certificate || req.params.certificate || req.query.certificate;
        event.like = req.body.like || req.params.like || req.query.like;

        event.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }            
            //@@new added
            /*Ecounter.update({_id: "num"}, {$inc: {seq: 1}},
                         function(err, output){ 
                            if(err){
                                console.log(err); return res.status(500).json({error: err});
                            }
                            console.log("!==== "+ "전체 이벤트 개수 +1");
                        });*/s
            //console.log('insert성공');
            
            res.json({result: 1});
        });
        
        //Ecounter
        
    });
    
    // CREATE(INSERT) REPLY
     app.use('/api/events/reply/write', function(req, res){
        var reply = new Reply();
        var i_pid = req.body.pid || req.params.pid || req.query.pid;
        reply.pid = req.body.pid || req.params.pid || req.query.pid;
        reply.writer = req.body.device_id || req.params.device_id || req.query.device_id;        
        reply.text = req.body.replyText || req.params.replyText || req.query.replyText;            

        reply.save(function(err){
            if(err){
                console.error(err);
                return res.status(500).json({error: err});
            }
             console.log("!==== "+ "댓글작성됨 / "+i_pid+"번 이벤트.");
            res.json({result: 1});
            
            Event.update({pid: i_pid}, {$inc: {rpl_count: 1}},
                         function(err, output){ 
                            if(err){
                                console.log(err); return res.status(500).json({error: err});
                            }
                            console.log("!==== "+ "업데이트도됨");
                        });
        });
    });    
    
    
    app.use('/api/events/feel', function(req, res){
            var feelStatus = new Feel();
        
            var i_pid = req.params.pid || req.query.pid || req.body.pid;
            var i_device_id = req.params.device_id || req.query.device_id || req.body.device_id;
            var i_feel = req.params.feel || req.query.feel || req.body.feel;        
            var yn = req.params.yn || req.query.yn || req.body.yn; // 기존의 감정 상태: true/false
            var va1; // event의 count 변화 값: +1/-1
        
            // 클릭 시, 기존의 감정 상태의 토글값을 얻음
            if (yn == true || yn == 1) { 
                yn = false; 
                val1 = -1; }
            else { 
                yn = true; 
                val1 = 1; }//console.log(i_pid+ '/' + i_device_id + '/' + i_feel + '/' + yn);//체크
        
            feelStatus.pid = i_pid; 
            feelStatus.device_id = i_device_id;
        
            //클릭된 감정의 종류에 따라 (code값 - like:0, nolike:1, cheer:2, sad:3, anger:4)
            if (i_feel == "0" || i_feel == 0 ) {
                feelStatus.like = yn;                
                Event.update({pid: i_pid}, {$inc: {like_count: val1}},//mongoose안에 js들어가야함..new가아닌데될까?
                         function(err){
                            if(err){ console.log(err); return res.status(500).json({error: err}); }
                        });
            }
            else if(i_feel == "1" || i_feel == 1) {
                feelStatus.nolike = yn;
                Event.update({pid: i_pid}, {$inc: {noLike_count: val1}},//mongoose안에 js들어가야함..new가아닌데될까?
                         function(err){
                            if(err){ console.log(err); return res.status(500).json({error: err}); }
                        });            
            }
            else if(i_feel == "2" || i_feel == 2) {
                feelStatus.cheer = yn;
                 Event.update({pid: i_pid}, {$inc: {cheer_count: val1}},//mongoose안에 js들어가야함..new가아닌데될까?
                         function(err){
                            if(err){ console.log(err); return res.status(500).json({error: err}); }
                        });
            }
            else if(i_feel == "3" ||i_feel == 3) {
                feelStatus.sad = yn;
                 Event.update({pid: i_pid}, {$inc: {sad_count: val1}},//mongoose안에 js들어가야함..new가아닌데될까?
                         function(err){
                            if(err){ console.log(err); return res.status(500).json({error: err}); }
                        });
            }
            else {
                feelStatus.anger = yn;
                 Event.update({pid: i_pid}, {$inc: {anger_count: val1}},//mongoose안에 js들어가야함..new가아닌데될까?
                         function(err){
                            if(err){ console.log(err); return res.status(500).json({error: err}); }
                        });       
            }        
        
            Feel.findOne({pid: i_pid, device_id: i_device_id}, function(err, event){                
                //console.log('!!!===== findOne 시도 : '+ i_pid+'/'+i_device_id+'/'+i_feel + '/' +yn);
                if(err) {return res.status(500).json({error: err});}
                if(!event){//console.log("!!!===== 해당 없습니다 ");                  
                    feelStatus.save(function(err){
                       if(err){
                            console.error(err);
                            return res.status(500).json({error: err});
                            }
                        res.json({result: 1, kind: "save"});//console.log("!!!===== 새로 INSERT ");
                        return;
                    });                  
                }
                else {//console.log("!!!===== 업데이트 됐습니다 ");                    
                    if(i_feel == 0){
                        Feel.update({pid: i_pid, device_id: i_device_id}, {$set: {like: yn}},
                        function(err, output){ console.log("!==== "+ i_feel) });
                    }
                    else if(i_feel == 1){
                        Feel.update({pid: i_pid, device_id: i_device_id}, {$set: {noLike: yn}},
                        function(err, output){ console.log("!==== "+ i_feel) });
                    }  
                    else if(i_feel == 2){
                        Feel.update({pid: i_pid, device_id: i_device_id}, {$set: {cheer: yn}},
                        function(err, output){ console.log("!==== "+ i_feel) });
                    }  
                    else if(i_feel == 3){
                        Feel.update({pid: i_pid, device_id: i_device_id}, {$set: {sad: yn}},
                        function(err, output){ console.log("!==== "+ i_feel) });
                    }  
                    else {
                        Feel.update({pid: i_pid, device_id: i_device_id}, {$set: {anger: yn}},
                        function(err, output){ console.log("!==== "+ i_feel) });                        
                    }
                    res.json({result: 1, kind: "update"}); return;
                    }    
                })
    });
  
   /*
     app.post('/api/events/write', function(req, res){
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
    });*/
    
    //No use
    /* 
    app.put('/api/events/like/:pid', function(req, res){
        Event.update({ pid: req.params.pid }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure...Whattt' });
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
   *
    });    */
    
    
    // No Use - UPDATE THE EVENT
   /* app.put('/api/events/:event_id', function(req, res){
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
    *
    });*/

    // No Use - DELETE EVENT
    /*
    app.delete('/api/events/:event_id', function(req, res){
        Event.remove({ _id: req.params.event_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "event not found" });
            res.json({ message: "event deleted" });
            *

            res.status(204).end();
        })
    });*/
     
}
