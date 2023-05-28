
* CONST_VARIABLES

* remove console.logs
  * server
  * frotnend

* gör så man kan ändra namn 

* styling 404 knapp - reverse clrs,

* add v1 to api

* only make it possible to delete an account which has no money, oterhwise, urge user to make withdraw first


// Validation
const accountName = object({
    acc_name: string().required(),
});

  // validateSync() - synchronous validation method
        // validate() - asynchronous validation method
        const entry = accountName.validateSync(req.body);
        console.log(entry);





 