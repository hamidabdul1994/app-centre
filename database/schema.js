/**
 * define require module
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
    mongoose.Promise = global.Promise;

var url = 'mongodb://localhost:27017/appCentre';
var connection = mongoose.connect(url);
autoIncrement.initialize(connection);


/**
 * Define category Schema
 * also define the model and export
 */
var category = mongoose.Schema({
      package_id: {
        type: Number,
        required: true
    },
    package_name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    GPcategory: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

category.plugin(autoIncrement.plugin,{ model: 'category', field: 'package_id' });
var category = mongoose.model('category', category);
/**
 * @exports {feedback}
 **/
exports.category = category;

// var angularUser = mongoose.Schema({
//     name: {
//         type: String
//     },
//     email: {
//         type: String
//     },
//     password: {
//         type: String
//     },
//     contact: {
//         type: String
//     },
//     token: {
//         type: String
//     },
//     github: {
//         type: String
//     }
// });
// var angularUser = mongoose.model('angularUser', angularUser, 'angularUser');
// /**
//  * @exports {angularUser}
//  */
// exports.angularUser = angularUser;
// var Demo = mongoose.Schema({
//     username: {
//         type: String
//     },
//     mobile: {
//         type: String
//     },
//     image: {
//         type: Buffer
//     },
//     syncTime: {
//         type: Date,
//         default: Date.now,
//         required: true
//     }
// });
//
// var Demo = mongoose.model('Demo', Demo, 'Demo');
// /**
//  * @exports {Demo}
//  */
// exports.Demo = Demo;
//
// /**
//  * for Demo
//  */
// var Names = mongoose.Schema({
//     first: {
//         type: String,
//         lowercase: true,
//         trim: true,
//         required: true
//     },
//     middle: {
//         type: String,
//         lowercase: true,
//         trim: true
//     },
//     last: {
//         type: String,
//         lowercase: true,
//         trim: true,
//         required: true
//     },
//     full: {
//         type: String,
//         lowercase: true,
//         trim: true
//     }
// });
//
// var userSchema = mongoose.Schema({
//     name: [Names] // using Names Embedded schema defined above
//         ,
//     avtar: String,
//     gender: {
//         type: String,
//         required: true
//     },
//     age: {
//         type: Number,
//         required: true
//     },
//     isActive: {
//         type: Boolean,
//         default: 0
//     }
// });
// var Users = mongoose.model('Users', userSchema, 'Users');
// /**
//  * @exports {users}
//  */
// exports.Users = Users;
