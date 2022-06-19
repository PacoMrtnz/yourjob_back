const Users = require("../models/user");
const Profiles = require("../models/profile");
const Posts = require("../models/Post");
const Jobs = require("../models/Jobs");
const Inscription = require("../models/Inscriptions");

module.exports = {
    user: Users,
    profile: Profiles,
    post: Posts,
    job: Jobs,
    inscription: Inscription
};
