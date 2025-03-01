<?php

define("DB_HOST", "127.0.0.1");
define("DB_USERNAME", "PIZZERIA");
define("DB_PASSWORD", "tC)L27T@sUuYnw92");
define("DB_DATABASE_NAME", "PIZZERIA");

define("HTTP_V", "HTTP/1.1");



/**DEFINIZIONE DELLE TABELLE*/

//ALLERGENE
define("DB_ALLERGENE", "ALLERGENE");
define("DB_ALLERGENE_ETICHETTA", "ETICHETTA");

//TIPO AGGIUNTA
define("DB_TIPOAGGIUNTA", "TIPO_AGGIUNTA");
define("DB_TIPOAGGIUNTA_ETICHETTA", 'ETICHETTA');

//AGGIUNTA
define("DB_AGGIUNTA", "AGGIUNTA");
define("DB_AGGIUNTA_NOME", "NOME");
define("DB_AGGIUNTA_PREZZO", "PREZZO");
define("DB_AGGIUNTA_QUANTITA", "QUANTITA");
define("DB_AGGIUNTA_IDTIPOAGGIUNTA", "ID_TIPO_AGGIUNTA");

//PIZZA
define("DB_PIZZA", "PIZZA");
define("DB_PIZZA_IDHASH", "ID_HASH");
define("DB_PIZZA_NOME", "NOME");
define("DB_PIZZA_PREZZO", "PREZZO");

//PIZZA_AGGIUNTA
define("DB_PIZZAAGGIUNTA", "PIZZA_AGGIUNTA");
define("DB_PIZZAAGGIUNTA_IDPIZZA", "ID_PIZZA");
define("DB_PIZZAAGGIUNTA_IDAGGIUNTA", "ID_AGGIUNTA");

//PIZZA ALLERGENE
define("DB_AGGIUNTAALLERGENE", "AGGIUNTA_ALLERGENE");
define("DB_AGGIUNTAALLERGENE_IDAGGIUNTA", "ID_AGGIUNTA");
define("DB_AGGIUNTAALLERGENE_IDALLERGENE", "ID_ALLERGENE");

//PRENOTAZIONE
define("DB_PRENOTAZIONE", "PRENOTAZIONE");
define("DB_PRENOTAZIONE_NOME", "NOME"); //Nome alla quale è stato prenotato
define("DB_PRENOTAZIONE_DATAPRENOTAZIONE", "DATA_PRENOTAZIONE");
define("DB_PRENOTAZIONE_DATAAVVENIMENTO", "DATA_AVVENIMENTO");
define("DB_PRENOTAZIONE_STATO", "STATO");
define("DB_PRENOTAZIONE_NUMEROPERSONE", "NUMERO_PERSONE");
define("DB_PRENOTAZIONE_TIPO", "TIPO");
define("DB_PRENOTAZIONE_DESCRIZIONESTATO", "DESCRIZIONE_STATO");
define("DB_PRENOTAZIONE_IDTAVOLO", "ID_TAVOLO");
define("DB_PRENOTAZIONE_USERID", "USER_ID");
define("DB_PRENOTAZIONE_TELEFONO", "TELEFONO");

//TAVOLO
define("DB_TAVOLO", "TAVOLO");
define("DB_TAVOLO_POSTI", "POSTI");

//ORDINE
define("DB_ORDINE", "ORDINE");
define("DB_ORDINE_IDPRENOTAZIONE", "ID_PRENOTAZIONE");
define("DB_ORDINE_IDPIZZA", "ID_PIZZA");

//ORDINE AGGIUNTA
define("DB_ORDINEAGGIUNTA", "ORDINE_AGGIUNTA");
define("DB_ORDINEAGGIUNTA_IDORDINE", "ID_ORDINE");
define("DB_ORDINEAGGIUNTA_IDAGGIUNTA", "ID_AGGIUNTA");

//ORDINE ALLERGENE
define("DB_ORDINEALLERGENE", "ORDINE_ALLERGENE");
define("DB_ORDINEALLERGENE_IDORDINE", "ID_ORDINE");
define("DB_ORDINEALLERGENE_IDALLERGENE", "ID_ALLERGENE");

//ANAGRAFICA
define("DB_ANAGRAFICA", "ANAGRAFICA");
define("DB_ANAGRAFICA_NOME", "NOME");
define("DB_ANAGRAFICA_COGNOME", "COGNOME");
define("DB_ANAGRAFICA_USERNAME", "USERNAME");
define("DB_ANAGRAFICA_PASSWORD", "PSW");
define("DB_ANAGRAFICA_IDRUOLO", "ID_RUOLO");

//RUOLO
define("DB_RUOLO", "RUOLO");
define("DB_RUOLO_NOME", "NOME_RUOLO");
define("DB_RUOLO_IDENTIFICATIVO", "IDENTIFICATIVO");

/**DEFINIZIONE DEI MODULI**/
define("MODULE_ALLERGENE", "allergene");
define("MODULE_PIZZA", "pizza");
define("MODULE_AGGIUNTA", "aggiunta");
define("MODULE_TIPOAGGIUNTA", "tipoaggiunta");
define("MODULE_PRENOTAZIONE", "prenotazione");
define("MODULE_ORDINE", "ordine");
define("MODULE_COOKIE", "cookie");
define("MODULE_ANAGRAFICA", "anagrafica");

/*DEFINIZIONE STATO PRENOTAZIONE*/
define("PRENOTAZIONE_STATO_BOZZA", "'0'");
define("PRENOTAZIONE_STATO_CONFERMATO", "'1'");
/**DEFINIZIONE TIPO PRENOTAZIONE */
define("PRENOTAZIONE_TIPO_TAVOLO", "'0'");
define("PRENOTAZIONE_TIPO_ASPORTO", "'1'");
/**DEFINIZIONE DESCRIZIONE STATO PRENOTAZIONE */
define("DESCRIZIONE_PRENOTAZIONE_STATO_BOZZA", "'Puoi ancora modificare il tuo ordine'");
define("DESCRIZIONE_PRENOTAZIONE_STATO_CONFERMATO", "'Il tuo ordine è stato confermato'");

/* DEFINIZIONE DEI RUOLI */
define("RUOLO_RESPONSABILE", "Responsabile");
define("RUOLO_PIZZAIOLO", "Pizzaiolo");
define("RUOLO_CAMERIERE", "Cameriere");
define("RUOLO_MAGAZZINIERE", "Magazziniere");

define("COOKIE_NAME" , "usrcok");