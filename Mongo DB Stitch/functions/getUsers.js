exports = async function(args) {
  const user_id = context.user.id;
  
  const result = await context.functions.execute("CheckIfAdmin", user_id);
  if(result.success == false)
    return result;
  
  let { PageNo, PageSize, OrderBy, OrderByDescending, Search }  =  args;
  
  PageNo = PageNo > 0 ? PageNo: 1;
  PageSize = PageSize > 0 ? PageSize: 25;
  OrderBy = OrderBy && OrderBy != ''? OrderBy: 'CreatedOn';
  OrderByDescending = OrderByDescending && OrderByDescending == true ? true: false;
  
  const offset = (PageNo - 1) * PageSize;
  
  let orderObject = {};
  orderObject[OrderBy] = OrderByDescending? -1 : 1;
  
  let whereObject = {};
  
  if(Search && Search != '') {
    let regxName = BSON.BSONRegExp(Search);
    
    whereObject = {
      $or:[
        {"FirstName": { $regex: regxName, $options: 'i' } },
        {"LastName": { $regex: regxName, $options: 'i' } },
        {"Email": { $regex: regxName, $options: 'i' } }
    ]};
  }
  
  whereObject.ClarityAdmin = true;
  whereObject.RecordDeleted = false;
  
  const pipeline = [
	  { $match: whereObject },
    { $project : { UserId: 1, FirstName : 1, LastName : 1, Email: 1, Active: 1, CreatedOn: 1, LastLogin: 1 } },
	  { $sort : orderObject },
    { "$skip" : offset },
    { "$limit": PageSize }
  ];

  const config = context.values.get('Configuration');
  const mongodb = context.services.get('mongodb-atlas');
  const usersCollection = mongodb.db(config.database).collection('users');
   
  const clarityUsersCount = usersCollection.count(whereObject);         
  const clarityUsers = usersCollection
                                .aggregate(pipeline)
                                .toArray();
            
  if(!clarityUsers)
    return { status: true, data: [], totalRecords: 0 };
  else
    return { status: true, data: clarityUsers, totalRecords: clarityUsersCount};
};