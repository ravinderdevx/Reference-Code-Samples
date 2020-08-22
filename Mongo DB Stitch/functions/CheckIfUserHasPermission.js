exports = async function(user_id) {
  const config = context.values.get('Configuration');
  const messages = context.values.get('Messages');
  
  if(!user_id || user_id == '')
    return { success: false, message: messages.error.USER_NOT_FOUND };

  const mongodb = context.services.get('mongodb-atlas');
  const userCollection = mongodb.db(config.database).collection('users');

  const user = await userCollection.findOne({UserId: user_id, Active: true, RecordDeleted: false});
  
  if(!user)
    return { success: false, message: messages.error.USER_NOT_FOUND };
    
  if(user.ClarityAdmin == true || user.ClaritySuperAdmin == true  || user.CompanyAdmin == true) {
    return { success: true, companyId: user.CompanyAdmin? String(user.CompanyId): null, userId: user.CompanyAdmin? user.UserId: null  };
  }
  
  return { success: false, message: messages.error.USER_HAS_NO_PERMISSION };
};