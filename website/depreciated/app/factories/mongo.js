
//LCD Setup
var LCD = require('lcd-pcf8574')
var lcd = new LCD('/dev/i2c-1', 0x27)


var mongoose = requrie('mongoose')
mongoose.connect('mognodb://beagleserver')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("YAY!")
})

var quizdbSchema = mongoose.Schema({
    quiz : {
        quizname : String,
        quizmasters : {
            openid : String
        },
        contestants : {
            carduid : String,
            team_number : Number,
            team_name : String,
            team_ans : Number,
            openid : String
        },
        quiz_qns : {
            qn : String,
            ans_arr : [String],
            ans_corr : Number,
            time_limit : Number
        },
        state : {
            qn_state : Number,
            time : Number,
            quiz_ans : {
                qn_no : Number,
                team_answers : [Number],
                time_ans : [Date]
            },
            team_correct_ans : [Number],
            questions_in_play : [Boolean],
            ended : Boolean
        },
        sponsor_logo : String
    },
    users : {
        openid : String,
        name : String,
        email : String,
        quizname_participating : [String],
        email_updates : [Boolean]
    },
    quizname_active : [String],
    quiz_port : [String]
})



lcd.clear().setCursor(0,2).print('Database Initialised')
