const mongoose=require("mongoose");
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});
const articleSchema={
  title:String,
  content:String
};
const Article=mongoose.model("Article",articleSchema);
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})
.post(function(req,res){
  const newArticle=new Article({
  title:req.body.title,
  content:req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("successfully created your article")
  }
  else{
    res.send(err);
  }
});
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted the articles");
    }
    else{
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("ARTICLE NOT FOUND");
    }
  });
})
.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("successfully updated the article");
      }
      else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
      if(!err){
        res.send("successfully deleted the article");
      }else{
        res.send(err);
      }
    });
  });


app.listen(3000,function(req,res){
  console.log("server is up and running at port 3000");
});
