

Fonctionnalitées :
    - Register  / Login / Logout avec gestion basiques des tokens HTTP
    - Récupérer la liste des bières
    - Ajouter une bière
    - Noter une bière
    - Commenter une bière
    - Mettre a jour une bière
    - Gerer sa liste de favoris
    - Mettre a jour le prix d'une bière

Description d'une bière :

{
    "id"=ObjectId()
    "name":"", // MANDATORY
    "country":"" // MANDATORY Standardistation à définir
    "company":""
    "alcool":0.0 //Float. Taux d'alcool
    "type":1 //Table de correspondance a mettre en place
    "rate":
    {
        "average" : 4,
        "entries" : 17
    }
    "barcode" : 123
    "comments":
    [
        "",
        "",
        ""
    ]

}
