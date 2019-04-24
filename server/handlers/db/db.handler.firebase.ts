import {DBService} from "./db.handler.interface";
import firebase from "firebase";
var config = require('../../config/fb.config.json');

export class FirebaseDBHandler implements DBService {
    init(): void {
        firebase.initializeApp(config);
    }

    get(req, res): void {
        
	    console.log("HTTP Get Request");
	    var userReference = firebase.database().ref("/Users/");

        //Attach an asynchronous callback to read the data
        userReference.on("value", 
			function(snapshot) {
				console.log(snapshot.val());
				res.json(snapshot.val());
				userReference.off("value");
			}, 
			function (errorObject) {
				console.log("The read failed: " + errorObject.code);
				res.send("The read failed: " + errorObject.code);
			});
    }

    put(req, res) {
        console.log("HTTP Put Request");

        var userName = req.body.UserName;
        var name = req.body.Name;
        var age = req.body.Age;

        var referencePath = '/Users/'+userName+'/';
        var userReference = firebase.database().ref(referencePath);
        userReference.set({Name: name, Age: age}, 
            function(error) {
                if (error) {
                    res.send("Data could not be saved." + error);
                } else {
                    res.send("Data saved successfully.");
                }
        });
    }

    post(req, res) {
        console.log("HTTP POST Request");

        var userName = req.body.UserName;
        var name = req.body.Name;
        var age = req.body.Age;

        var referencePath = '/Users/'+userName+'/';
        var userReference = firebase.database().ref(referencePath);
        userReference.update({Name: name, Age: age}, 
            function(error) {
                if (error) {
                    res.send("Data could not be updated." + error);
                } else {
                    res.send("Data updated successfully.");
                }
            });
        }

    delete(req, res) {
        console.log("HTTP DELETE Request");
      //todo
    }

}