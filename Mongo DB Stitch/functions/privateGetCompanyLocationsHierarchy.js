exports = async function(arg) {
  const mongodb = context.services.get('mongodb-atlas');
  const dbcontext = mongodb.db(arg.database);
  const locationGroupsCollection = dbcontext.collection('location_groups');
  
  return await locationGroupsCollection.aggregate([ 
          { $unwind: { path: "$LocationIds", preserveNullAndEmptyArrays: true } },
              // Do the lookup matching
              { $lookup: {
                from: "locations",
                localField: "LocationIds",
                foreignField: "_id",
                as: "Locations"
              }},
              { $unwind: { path: "$Locations", preserveNullAndEmptyArrays: true } },
              { $sort : { "Locations.LocationName": 1 } },
            // Group back to arrays
            { $group: {
                "_id": "$_id",
                "ParentGroupId": {$first: "$ParentGroupId" },
                "GroupName": {$first: "$GroupName" },
                "LocationIds": { $push: "$LocationIds" },
                "Locations": { $push: "$Locations" }
            }
            },
            { $match: { $or: [{ ParentGroupId: { $exists: false } }, {ParentGroupId: null }] } },
            {
              $graphLookup: {
                 from: "location_groups",
                 startWith: "$_id",
                 connectFromField: "_id",
                 connectToField: "ParentGroupId",
                 as: "Childrens"
              }
           },
          { $sort : { GroupName : 1 } }
          ]).toArray();
};