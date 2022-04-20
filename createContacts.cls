public with sharing class createContacts {
    
    @AuraEnabled
    public static List<Contact> saveContacts(List<Contact>conList){
        insert conList;
        return conList;
        
    }


    @AuraEnabled
    public static List<contactdummy> fetchContacts(string recordId){
        List<contactdummy>conListFinal=new List<contactdummy>();
        for(contact con:[Select Id,Bank__r.Name,Bank__r.Id,Phone,Email,LastName from Contact  WHERE AccountId=:recordId LIMIT 100])
        {
            contactdummy condummy=new contactdummy();
            condummy.LastName=con.LastName;
            condummy.Id=con.Id;
            condummy.Phone=con.Phone;
            condummy.Email=con.Email;
            condummy.BankName=con.Bank__r.Name;
            condummy.bankc=con.Bank__r.Id;
            conListFinal.add(condummy);
            system.debug('Contact Id '+con.Id +'Bank Name '+con.Bank__r.Name+'Bank Id '+con.Bank__r.Id+' Contact Name '+con.LastName);

        }
        return conListFinal;
        
    }

    @AuraEnabled(cacheable=true)
    public static string deleteContacts(string recordId){
        Contact con=[Select Id,Phone,Email,LastName from Contact WHERE Id=:recordId];
        try {
             delete con;
             return 'SUCCESS';
        } catch (Exception e) {
            return 'ERROR';
            
        }

    }


    @AuraEnabled
    public static string addUpdateContact(Object payload,List<String> deleteList)
    {
        List<Contact>newContacts=(List<Contact>) JSON.deserialize(JSON.serialize(payload),List<Contact>.class);
        List<Contact> contactList =new List<Contact>();
       if(!deleteList.isEmpty())
       {
           contactList=[Select Id from Contact Where Id IN:deleteList];
       }


         try {
             if(!newContacts.isEmpty() )
             {
                 upsert newContacts;
             }if(!contactList.isEmpty())
             {
                 delete contactList;
             }
             return 'Success';

         } catch (Exception e) {
             string error='The following exception has Occured '+e.getMessage();
             throw new AuraHandledException(error);
         }


        
    }

    class contactdummy
    {
        @AuraEnabled
        public string Id;

        @AuraEnabled
        public string BankName;

        @AuraEnabled
        public string Email;

        @AuraEnabled
        public string LastName;

        @AuraEnabled
        public string Phone;

        @AuraEnabled
        public string bankc;

       


      
    }





        
    
}
