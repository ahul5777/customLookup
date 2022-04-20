public without sharing class Lookup {

    @AuraEnabled(cacheable=true)
    public static List<sObject> search(String searchTerm, string myObject) {
        String myQuery = null;
        
            if(searchTerm == null || searchTerm == ''){
                myQuery = 'Select Id, Name from '+myObject+'  ORDER BY LastViewedDate DESC LIMIT  5';
            }
            else {
                myQuery = 'Select Id, Name from '+myObject+' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';
            }
        
        List<sObject> lookUpList = database.query(myQuery);
        return lookUpList;
    }
}