/*********************************************************************************
*  BTI325 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___________CHENGHAO Hu___________ Student ID: _____149773228_________ Date: ________2024/11/27________
*
*  Online (Vercel) Link: ________________________________________________________
*
********************************************************************************/

const express = require("express");
const exphbs = require("express-handlebars");
const blogService = require("./blog-service");
const path = require("path");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine(
    ".hbs",
    exphbs.engine({
        extname: ".hbs",
        defaultLayout: "main",
        helpers: {
            navLink: function (url, options) {
                return (
                    '<li' +
                    (url === options.data.root.activeRoute ? ' class="active"' : '') +
                    '><a href="' +
                    url +
                    '">' +
                    options.fn(this) +
                    '</a></li>'
                );
            },
            formatDate: function (dateObj) {
                let year = dateObj.getFullYear();
                let month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
                let day = dateObj.getDate().toString().padStart(2, "0");
                return `${year}-${month}-${day}`;
            },
        },
    })
);
app.set("view engine", ".hbs");

app.use((req, res, next) => {
    let route = req.path.substring(1);
    res.locals.activeRoute = route === "" ? "/" : "/" + route.split("/")[0];
    next();
});


app.get("/", (req, res) => {
    res.redirect("/blog");
});

app.get("/blog", (req, res) => {
    blogService.getPublishedPosts()
        .then((data) => {
            if (data.length > 0) {
                res.render("blog", { posts: data });
            } else {
                res.render("blog", { message: "No blog posts available" });
            }
        })
        .catch(() => {
            res.render("blog", { message: "Unable to fetch blog posts" });
        });
});

app.get("/about", (req, res) => {
    res.render("about");
});


app.get("/posts", (req, res) => {
    blogService.getAllPosts()
        .then((data) => {
            if (data.length > 0) {
                res.render("posts", { posts: data });
            } else {
                res.render("posts", { message: "No results" });
            }
        })
        .catch(() => {
            res.render("posts", { message: "No results" });
        });
});

app.get("/posts/add", (req, res) => {
    blogService.getCategories()
        .then((data) => {
            res.render("addPost", { categories: data });
        })
        .catch(() => {
            res.render("addPost", { categories: [] });
        });
});

app.post("/posts/add", (req, res) => {
    blogService.addPost(req.body)
        .then(() => {
            res.redirect("/posts");
        })
        .catch(() => {
            res.status(500).send("Unable to add post");
        });
});

app.get("/categories", (req, res) => {
    blogService.getCategories()
        .then((data) => {
            if (data.length > 0) {
                res.render("categories", { categories: data });
            } else {
                res.render("categories", { message: "No results" });
            }
        })
        .catch(() => {
            res.render("categories", { message: "Unable to retrieve categories" });
        });
});


app.get("/categories/add", (req, res) => {
    res.render("addCategory");
});

app.post("/categories/add", (req, res) => {
    blogService.addCategory(req.body)
        .then(() => {
            res.redirect("/categories");
        })
        .catch(() => {
            res.status(500).send("Unable to add category");
        });
});

app.get("/posts/delete/:id", (req, res) => {
    blogService.deletePostById(req.params.id)
        .then(() => {
            res.redirect("/posts");
        })
        .catch(() => {
            res.status(500).send("Unable to remove post / Post not found");
        });
});

app.get("/categories/delete/:id", (req, res) => {
    blogService.deleteCategoryById(req.params.id)
        .then(() => {
            res.redirect("/categories");
        })
        .catch(() => {
            res.status(500).send("Unable to remove category / Category not found");
        });
});

app.use((req, res) => {
    res.status(404).render("404");
});

blogService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error(`Unable to start the server: ${err}`);
    });