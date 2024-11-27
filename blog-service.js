const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres.szoirmbisytcodzqzili', 'Wanba6573hjw@', {
    host: 'aws-0-ca-central-1.pooler.supabase.com',
    dialect: 'postgres',
    port: 6543,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
        query: { raw: true } 
    });

const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

const Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, { foreignKey: 'category' });

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch(() => reject("Unable to sync the database"));
    });
};

module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
};

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { category } })
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
};

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;

        for (let key in postData) {
            if (postData[key] === "") postData[key] = null;
        }
        postData.postDate = new Date();

        Post.create(postData)
            .then(() => resolve())
            .catch(() => reject("Unable to create post"));
    });
};

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        Category.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("No results returned"));
    });
};

module.exports.getPublishedPosts = () => {
    return new Promise((resolve, reject) => {
        Post.findAll({ where: { published: true } })
            .then(data => resolve(data))
            .catch(() => reject("No published posts found"));
    });
};

module.exports.addCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        for (let key in categoryData) {
            if (categoryData[key] === "") categoryData[key] = null;
        }

        Category.create(categoryData)
            .then(() => resolve())
            .catch(() => reject("Unable to create category"));
    });
};

module.exports.deletePostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.destroy({ where: { id } })
            .then(() => resolve())
            .catch(() => reject("Unable to delete post"));
    });
};

module.exports.deleteCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        Category.destroy({ where: { id } })
            .then(() => resolve())
            .catch(() => reject("Unable to delete category"));
    });
};
