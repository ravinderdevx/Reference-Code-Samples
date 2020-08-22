exports = async function(arg) {
  const config = context.values.get('Configuration');
  const mongodb = context.services.get('mongodb-atlas');
  const dbcontext = mongodb.db(config.database);
  const screensCollection = dbcontext.collection('screens');
  

  let matchCondition = { };
  
 if(arg.withoutAdminScreens && arg.withoutAdminScreens == true) {
    matchCondition = { 
                $or:[
                  {ScreenUrl: { $regex: new BSON.BSONRegExp("/reports", "i") } },
                  {ServiceIds: { $in: arg.ServiceIds } }
                ]
              };
  } else {
    matchCondition = { 
                $or:[
                  {ServiceIds: { $exists: false } },
                  {ServiceIds: { $in: arg.ServiceIds } }
                ]
              };
  }
  
  
  return await screensCollection.aggregate([ 
          { $unwind: { path: "$ServiceIds", preserveNullAndEmptyArrays: true } },
          { $match: { 
                $or:[
                  {ServiceIds: { $exists: false } },
                  {ServiceIds: { $in: arg.ServiceIds } }
                ]
              } 
            
          },
          { $match: matchCondition },
              // Do the lookup matching
              { $lookup: {
                from: "services",
                localField: "ServiceIds",
                foreignField: "_id",
                as: "Services"
              }},
              { $unwind: { path: "$Services", preserveNullAndEmptyArrays: true } },
              { $sort : { "Services.ServiceName": 1 } },
            // Group back to arrays
            { $group: {
                "_id": "$_id",
                "ParentScreenId": {$first: "$ParentScreenId" },
                "ScreenName": {$first: "$ScreenName" },
                "ScreenTitle": {$first: "$ScreenTitle" },
                "ScreenUrl": {$first: "$ScreenUrl" },
                "Order": {$first: "$Order"},
                "MenuIcon": {$first: "$MenuIcon"},
                "ServiceIds": { $push: "$ServiceIds" },
                "Services": { $push: "$Services" }
            }
            
            },
            { $match: { $or: [{ ParentScreenId: { $exists: false } }, {ParentScreenId: null }] } },
            {
              $graphLookup: {
                 from: "screens",
                 startWith: "$_id",
                 connectFromField: "_id",
                 connectToField: "ParentScreenId",
                 as: "ChildScreens"
              }
           },
          { $sort : { Order : 1, ScreenName: 1 } }
          ]).toArray();
};