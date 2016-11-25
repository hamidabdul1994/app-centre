/**
 * define require module
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
 var url = 'mongodb://my-app-centre.herokuapp.com/appCentre';
// var url = 'mongodb://localhost:27017/appCentre';
var connection = mongoose.connect(url);
autoIncrement.initialize(connection);


/**
 * Define category Schema
 * also define the model and export
 */
var category = mongoose.Schema({
    packageId: {
        type: Number,
        required: true,
        default: 1
    },
    packageName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    locale: {
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

category.plugin(autoIncrement.plugin, {
    model: 'category',
    field: 'packageId',
    startAt: 1
});
var category = mongoose.model('category', category);
/**
 * @exports {feedback}
 **/
exports.category = category;
