var express = require('express');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var app = express();

var contexts = [];

app.get('/smssent', function (req, res) {
    var message = req.query.Body;
    var number = req.query.From;
    var twilioNumber = req.query.To;


    var context = null;
    var index = 0;
    var contextIndex = 0;
    contexts.forEach(function(value) {
        console.log(value.from);
        if (value.from == number) {
            context = value.context;
            contextIndex = index;
        }
        index = index + 1;
    });


app.get('/',function(req,res) {
    console.log('request received for data' + req.Body)
});
    console.log('Recieved message from ' + number + ' saying \'' + message  + '\'');

    var conversation = new ConversationV1({
        username: '4dab8c2d-7b76-4b49-8078-dfc4586f9d03',
        password: '3SCUiNvhm4U5',
        version_date: ConversationV1.VERSION_DATE_2017_06_22
    });

    console.log(JSON.stringify(context));
    console.log(contexts.length);

    conversation.message({
        input: { text: message },
        workspace_id: '8c4004c6-b256-4ef8-a53c-f8e07531f848',
        context: context
    }, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log(response.output.text[0]);
            if (context == null) {
                contexts.push({'from': number, 'context': response.context});
            } else {
                contexts[contextIndex].context = response.context;
            }

            var intent = response.intents[0].intent;
            console.log(intent);
            if (intent == "done") {

                contexts.splice(contextIndex,1);

            }

            var client = require('twilio')(
                'AC669d3ccc24dd9f82d7d98c6c2cdd0bbd',
                '8706df4d4005b95cb1f6f8621f9d5e2c'
            );

            client.messages.create({
                from: twilioNumber,
                to: number,
                body: response.output.text[0]
            }, function(err, message) {
                if(err) {
                    console.error(err.message);
                }
            });
        }
    });

    res.send('');
});

app.listen(3000, function () {
    console.log('chatbotdemowatson app listening on port 3000!');
});

module.exports = app;
