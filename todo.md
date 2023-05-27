
* CONST_VARIABLES
* remove verbs from server routes?
* check logout error, somethign worng?

* remove console.logs
  * server
  * frotnend

* gör så man kan ändra namn 

* styling login req + 404 med space,

* add v1 to api




// Validation
const accountName = object({
    acc_name: string().required(),
});

  // validateSync() - synchronous validation method
        // validate() - asynchronous validation method
        const entry = accountName.validateSync(req.body);
        console.log(entry);





 