/*
    Register this file as web resource. Use the same naming and folder structure as in this project.

    Group web resource files under entity-specific folders. Multiple entities can also be grouped under one sub-folder, 
    for example contract and contract products under Contract folder, if it seems more appropriate.
    Use the Common folder for generic libraries that are used in multiple different entities.

    Other libraries and web resources can also be created under the sub-folders as necessary.
    
    Web resource: cgi_/Contact/ContactForm.js

    Registration:
        Form libraries (only register the ones that are needed):
            cgi_/Contact/ContactForm.js
            cgi_/Common/CgiCommon.js

        Events:
            OnLoad: ContactForm.onLoad
            OnSave: ContactForm.onSave    
*/

var ContactForm = (function () {
    return {
        /* START events */
        onLoad: function (executionObject) {
            /* Register OnChange events in OnLoad to find them more easily  */
            //var formContext = executionObject.getFormContext();
            //formContext.getControl('cgi_field1').addOnChange(ContactForm.doSomething);

            //ContactForm.doSomething(executionObject);
            ContactForm.showDataBanStatus(executionObject);
        },
        onSave: function (executionObject) {
            ContactForm.doSomething(executionObject);
        },
        /* END events */

        /* "Public" functions. Can be called from outside the module using ContactForm.doSomething() */
        doSomething: doSomething,
        showDataBanStatus: showDataBanStatus
    };

    function showDataBanStatus(exObj) {
        if (Xrm.Utility.getGlobalContext().userSettings.languageId != null && exObj != null)
        {
            var userLanguage = Xrm.Utility.getGlobalContext().userSettings.languageId;
            var securedDataAlertText = "";
            if (userLanguage == 1033) {
                securedDataAlertText = "WARNING: Non-Disclosure for personal safety, more information from the local register office.";
            } else if (userLanguage == 1035) {
                securedDataAlertText += "VAROITUS: Turvakielto, lisätietoa maistraatista.";
            } else if (userLanguage == 1053) {
                securedDataAlertText = "VARNING: 'swedish description here...'";
            } else {
                securedDataAlertText = "WARNING: Non-Disclosure for personal safety, more information from the local register office.";
            }

            var formContext = exObj.getFormContext();
            if (formContext.getAttribute('cgi_nondisclosure').getValue() == true) {
                formContext.ui.setFormNotification(securedDataAlertText, "WARNING");
            }
        }
    }
    function doSomething(executionObject) {
        var contacts = CgiCommon.retrieveSomething();

    }
})();