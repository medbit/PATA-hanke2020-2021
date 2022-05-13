/*
    Register this file as web resource. Use the same naming and folder structure as in this project.
    
    Web resource: cgi_/Common/CgiCommon.js
*/

var CgiCommon = (function () {
    /* "Public" functions. Can be called from outside the module using CgiCommon.doAnotherThing() */
    return {
        retrieveSomething: retrieveSomething
    };

    function retrieveSomething() {
//        Xrm.WebApi.retrieveMultipleRecords('contact,', '$select=contactid&$top=2').then(function (contactRes) {
//            return contactRes.entities;
//        });
    }
})();