exports = async function(args) {
  let user_id = context.user.id;
  let companyUserId = args._id;
  let screenUrl = args.screenUrl;
  
  const messages = context.values.get('Messages');
  
  if(!companyUserId || companyUserId == '')
    return { success: false, message: messages.error.INVALID_REQUEST };
  
  if(args.companyId && args.companyId != '') {
    companyId = BSON.ObjectId(args.companyId);
    
    const result = await context.functions.execute("CheckIfAdmin", user_id);
    if(result.success == false)
      return result;
  } else {
    const result = await context.functions.execute("CheckIfUserHasScreenPermission", user_id, screenUrl);
    if(result.success == false)
      return result;
    
    companyId = result.user.CompanyId;
    
    if(!companyId || companyId == '')
      return { success: false, message: messages.error.NOT_A_COMPANY_USER };
  }
  
  const config = context.values.get('Configuration');
  const mongodb = context.services.get('mongodb-atlas');
  const usersCollection = mongodb.db(config.database).collection('users');
   
  const userDetails = usersCollection.findOne({_id: BSON.ObjectId(companyUserId), RecordDeleted: false });
  
  if(!userDetails)
    return { success: true, data: null };
  else
    return { success: true, data: userDetails};
};