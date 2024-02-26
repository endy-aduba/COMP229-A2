const getErrorMessage = (err) => {
     let message = '';
     if (err.code) {
         switch (err.code) {
             case 11000:
             case 11001:
                 message = getUniqueErrorMessage(err);
                 break;
             default:
                 message = 'Something went wrong';
         }
     } else {
         for (let errName in err.errors) {
             if (err.errors[errName].message) {
                 message = err.errors[errName].message;
             }
         }
     }
     return message;
 };
 
 const getUniqueErrorMessage = (err) => {
     let output;
     try {
         // Extracting field name from MongoDB error message
         let fieldName = '';
         // MongoDB error message format changed in newer versions, adjust accordingly
         if (err.message.includes('index: ')) {
             fieldName = err.message.substring(err.message.lastIndexOf('index: ') + 7, err.message.lastIndexOf('_1'));
         } else {
             // Extracting between `key: {` and `: 1`
             fieldName = err.message.substring(err.message.lastIndexOf('key: { ') + 6, err.message.lastIndexOf(': 1'));
         }
         fieldName = fieldName.trim(); // Trimming any possible leading or trailing spaces
         output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
     } catch (ex) {
         output = 'Unique field already exists';
     }
     return output;
 };
 
 export default { getErrorMessage };
 