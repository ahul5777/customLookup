public with sharing class createContacts {
    
   

    //fetching all contact assosciated with a parent
    //mocking the response into a dummy class(could not able to access custom field in the marup)
    @AuraEnabled
    public static List<contactdummy> fetchContacts(string recordId){
        List<contactdummy>conListFinal=new List<contactdummy>();
        if(!String.isEmpty(recordId))
        {
          for(contact con:[Select Id,Bank__r.Name,Bank__r.Id,Experience__c,Country__c,Phone,Email,LastName from Contact  WHERE AccountId=:recordId LIMIT 100])
        {
            contactdummy condummy=new contactdummy();
            condummy.LastName=con.LastName;
            condummy.Id=con.Id;
            condummy.Phone=con.Phone;
            condummy.Email=con.Email;
            condummy.BankName=con.Bank__r.Name;
            condummy.bankc=con.Bank__r.Id;
            condummy.country=con.Country__c;
            condummy.experience=con.Experience__c;
            conListFinal.add(condummy);
            system.debug('Contact Id '+con.Id +'Bank Name '+con.Bank__r.Name+'Bank Id '+con.Bank__r.Id+' Contact Name '+con.LastName);

        }
        return conListFinal;

        }
        else {
            return null;
        }
        
        
    }

    

//DML 
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
                  Database.insert(newContacts);
             }
             if(!contactList.isEmpty())
             {
                 Database.delete(contactList);
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

        @AuraEnabled
        public string country;

        @AuraEnabled
        public string experience;

       


      
    }





        
    
}
