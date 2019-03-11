#!/usr/bin/env node

const queryString = require('query-string');
const iplocation = require("iplocation").default;
const countryLookup = require('country-code-lookup');

const toAddress = 'xxx';

var send = require('gmail-send')({
    user: 'xxx',
    pass: 'xxx'
});

try {


    // Parse the form input data

    const input = queryString.parse(process.env.QUERY_STRING);

    // Look up the customers location

    iplocation(process.env.REMOTE_ADDR, [], function (err, ipLocationRes) {

        let country;
        let city;

        if (!err) {

            city = ipLocationRes.city;
            try {
                country = countryLookup.byIso(ipLocationRes.country).country;
            } catch(err) {
                // Do nothing
            }            

        }

        // Create email message

        const message = `<p>Customer Name: ${input.customerName}</p>
        <p>Customer Email Address: ${input.customerEmailAddress}</p>
        <p>Message Subject: ${input.messageSubject}</p>
        <p>Message:</p>
        <pre>${input.message}</pre>
        <p>Customer IP Address: ${process.env.REMOTE_ADDR}</p>
        <p>Customer User Agent: ${process.env.HTTP_USER_AGENT}</p>
        <p>Customer Country: ${country}</p>
        <p>Customer City: ${city}</p>`;

        // Send email

        send({
            subject: input.messageSubject,
            to: toAddress,
            html: message
        }, function (err) {

            if (err) {
                console.log("Status: 500 Error");
                console.log("");
                return;
            }

            console.log("Status: 302 Moved Temporarily");
            console.log("Location: /apache-web-server/contact-us/thank-you.html");
            console.log("");
            
        });

    });    


} catch(err) {

    console.log("Status: 500 Error");
    console.log("");

}
