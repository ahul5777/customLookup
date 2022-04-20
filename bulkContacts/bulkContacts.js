import { LightningElement,track,api,wire } from 'lwc';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import CONTACT_OBJECT from '@salesforce/schema/Contact';

import COUNTRY_FIELD from '@salesforce/schema/Contact.Country__c';

import EXPERIENCE__FIELD from '@salesforce/schema/Contact.Experience__c';

import fetchContacts from '@salesforce/apex/createContacts.fetchContacts';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import addUpdateContact from '@salesforce/apex/createContacts.addUpdateContact';

export default class BulkContacts extends LightningElement {


    //taking ID manually for testing
    recordId='0015g00000Rx6EaAAJ';

    @track keyIndex=0;

    @track deleteRecords=[];


    @track contactRecList;

  

    //getting objects metadata
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })

    contactMetadata;

   

    //getting picklist values for country
    @wire(getPicklistValues,

        {

            recordTypeId: '$contactMetadata.data.defaultRecordTypeId', 

            fieldApiName: COUNTRY_FIELD

        }

    )

    contactPicklist;



    //getting picklist values for experience
    @wire(getPicklistValues,

        {

            recordTypeId: '$contactMetadata.data.defaultRecordTypeId', 

            fieldApiName: EXPERIENCE__FIELD

        }

    )

    experiencePicklist;



    //getting existing data
   connectedCallback()
   {
      this.getData();
   }
 



   //getData method
    getData()
    {
        fetchContacts({recordId:this.recordId})
        .then(response=>
         {
             this.contactRecList=JSON.parse(JSON.stringify(response));
             this.error=undefined;
             console.log(this.contactRecList);
               
         })
         .catch(error=>
             {
                 this.error=error;
                 this.contactRecList=undefined;
             })

    }



   //adding a new row into the table
   addRow()
   {
       this.keyIndex++;
       this.contactRecList.push(
           {
        LastName:' ',
        Bank__c:' ',
        Email:' ',
        Phone:' ',
        AccountId:this.recordId
           }
       )
   }

   //binding tmp to JS
   changeHandler(event)
   {
       if(event.target.name==='LastName')
       {
          this.contactRecList[event.target.accessKey].LastName=event.target.value;
       
       
   }


    //deleting a row this does not delete row directly we neeed to save it commit changes
    //we are handling all dml inside a single apex method
   deletAction(event)
   {

    if(event.target.dataset.recordId)
    {
     this.deleteRecords.push(event.target.dataset.recordId);
    }

    if(this.contactRecList.length>=1)
    {
        this.contactRecList.splice(event.target.accessKey,1);
        this.keyIndex--;
    }
    console.log(event.target.dataset.recordId);
    console.log(this.contactRecList);

    }


    //commiting all results to DB
    saveAction()
    {
       let finalConList=this.contactRecList.filter(con => con.LastName != ' ');
       console.log(finalConList);
       console.log(finalConList.length);
       Object.assign({},finalConList);
        addUpdateContact({payload:finalConList,deleteList:this.deleteRecords})
        .then(response=>{
            this.getData();
            console.log(response);
            this.showToast('Success','Your Operation was successful!','SUCCESS');

        })
        .catch(error=>
            {
                 console.log(error.body.message);
                 this.showToast('Oops!','Something went Wrong!','Error');
            })
    }
    


    //toast method
   showToast(title,message,variant)
    {

    
         const event = new ShowToastEvent({
            title: title,
            message: message,
            variant:variant
      });
      this.dispatchEvent(event);
   }


   //getting lookup field record Id from child
   handleAccountSelection(event){
    console.log("the selected record id is"+event.detail);
    this.contactRecList[event.target.accessKey].Bank__c = event.detail;
    console.log(this.contactRecList[event.target.accessKey])
}



//country picklist change
countrychange(event)
{
    this.contactRecList[event.target.accessKey].Country__c = event.detail.value;
    console.log(this.contactRecList[event.target.accessKey].Country__c );

}

//experiencepicklistchange
experiencechange(event)
{
    this.contactRecList[event.target.accessKey].Experience__c = event.detail.value;
    console.log(this.contactRecList[event.target.accessKey].Experience__c );

}

       

}
