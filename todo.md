
* gå igenom så du alltid svara med kontot som du precis gjort något med vid routesen - server
<!-- * 404 vy -->
<!-- * error modal -->
* CONST_VARIABLES
* remove verbs from server routes?
<!-- * eroror login, regiestrerring -->
* check logout error, somethign worng?
<!-- * make error div to commponenet? -->
  <!-- * remove all weird classes col osv, row -->

* remove console.logs
  * server
  * frotnend

* gå igenom och skcika korrekta status koder vid error
<!-- * comment each route server -->

<!-- * ändra så man alltid redrirectas till /accounts vid succes inlog + reggning av anv. -->
* gör så man kan ändra namn 

* importera alla js filer som moduler

* styling login req + 404 med space,
  <!-- * ta bort punkten på 404 och home page -->
<!-- * remove text-underline från btn class -->

<!-- * todo some server sytem for when custom err msg is givne and when it gerenala autgenrerated -->


6463b2bb1353442f954d941e

import { object, string } from 'yup'

// Validation
const accountName = object({
    acc_name: string().required(),
});

  // validateSync() - synchronous validation method
        // validate() - asynchronous validation method
        const entry = accountName.validateSync(req.body);
        console.log(entry);


add v1 to api



